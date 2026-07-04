import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { jsPDF } from 'jspdf';

interface TransactionState {
  reference: string;
  date: string;
  montant: number;
  mode: string;
  derniersChiffres: string;
  statut: string;
  formation?: string;
  specialite?: string;
  nom?: string;
  prenom?: string;
  email?: string;
}

const defaultTransaction: TransactionState = {
  reference: 'STRIPE-TXN-7K2M9P',
  date: new Date().toISOString(),
  montant: 50000,
  mode: 'carte',
  derniersChiffres: '4242',
  statut: 'complete',
  formation: 'Non spécifiée',
  specialite: 'Non spécifiée',
  nom: '',
  prenom: '',
  email: '',
};

export default function PaiementSucces() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(8);
  const [isDownloading, setIsDownloading] = useState(false);

  const transaction: TransactionState = (location.state as TransactionState) || defaultTransaction;

  const formattedDate = new Date(transaction.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedHeure = new Date(transaction.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const modeLabel = transaction.mode === 'carte' ? 'Carte bancaire' : transaction.mode === 'mobile' ? 'Mobile Money' : 'Virement bancaire';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/candidat/tableau-de-bord');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const generatePDF = useCallback(() => {
    setIsDownloading(true);
    
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      let y = 25;

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(30, 30, 30);
      doc.text('PKFokam Institute of Excellence', pageW / 2, y, { align: 'center' });
      
      y += 12;
      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      doc.text('Recu de paiement', pageW / 2, y, { align: 'center' });
      
      y += 6;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, pageW - 20, y);
      
      y += 10;

      // Transaction info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);

      const leftX = 25;
      const rightX = pageW - 25;
      const col2X = 110;

      const addRow = (label: string, value: string, yPos: number, isAmount = false) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(label, leftX, yPos);
        doc.setFont('helvetica', isAmount ? 'bold' : 'normal');
        doc.setFontSize(isAmount ? 12 : 10);
        doc.setTextColor(isAmount ? 30 : 50, isAmount ? 30 : 50, isAmount ? 30 : 50);
        doc.text(value, rightX, yPos, { align: 'right' });
      };

      const rows = [
        { label: 'Reference de transaction', value: transaction.reference },
        { label: 'Date', value: formattedDate + ' a ' + formattedHeure },
        { label: 'Mode de paiement', value: modeLabel },
        { label: 'Carte', value: '.... ' + transaction.derniersChiffres },
        { label: 'Statut', value: 'Confirme' },
      ];

      rows.forEach((row) => {
        addRow(row.label, row.value, y);
        y += 8;
      });

      // Amount
      y += 4;
      doc.setDrawColor(220, 220, 220);
      doc.line(leftX, y, rightX, y);
      y += 8;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text('Montant total', leftX, y);
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 30);
      doc.text(transaction.montant.toLocaleString('fr-FR') + ' FCFA', rightX, y, { align: 'right' });

      // Candidate info
      if (transaction.nom || transaction.prenom) {
        y += 12;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, y, pageW - 20, y);
        y += 10;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text('Informations du candidat', leftX, y);
        y += 8;

        const candidateRows = [
          { label: 'Nom complet', value: `${transaction.prenom} ${transaction.nom}` },
          { label: 'Email', value: transaction.email },
        ];
        if (transaction.formation) {
          candidateRows.push({ label: 'Formation', value: transaction.formation });
        }
        if (transaction.specialite) {
          candidateRows.push({ label: 'Specialite', value: transaction.specialite });
        }

        candidateRows.forEach((row) => {
          addRow(row.label, row.value, y);
          y += 7;
        });
      }

      // Footer
      y += 12;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, pageW - 20, y);
      y += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Ce recu est genere automatiquement et fait office de preuve de paiement.', pageW / 2, y, { align: 'center' });
      y += 6;
      doc.text('PKFokam Institute of Excellence — Yaounde, Cameroun — contact@pkfokam.cm', pageW / 2, y, { align: 'center' });
      y += 6;
      doc.text('Paiement securise par Stripe — Transaction cryptee SSL', pageW / 2, y, { align: 'center' });

      doc.save(`recu-paiement-${transaction.reference}.pdf`);
    } catch (err) {
      console.error('Erreur generation PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  }, [transaction, formattedDate, formattedHeure, modeLabel]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500 w-8 h-8 flex items-center justify-center"></i>
          <p className="text-sm text-foreground-500 font-body">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Success Animation Card */}
        <div className="bg-white rounded-3xl border border-background-200/70 p-8 md:p-10 text-center shadow-sm">
          {/* Animated Check Circle */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30"></div>
            <div className="absolute inset-0 rounded-full bg-emerald-100"></div>
            <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center">
              <i className="ri-check-line text-white text-5xl w-14 h-14 flex items-center justify-center"></i>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground-950 mb-2">
            Paiement réussi !
          </h1>
          <p className="text-foreground-500 text-sm font-body mb-8">
            Votre paiement a été traité avec succès. Votre dossier progresse !
          </p>

          {/* Transaction Details */}
          <div className="bg-background-50 rounded-2xl border border-background-200/70 p-5 mb-8 text-left">
            <h3 className="text-xs font-semibold text-foreground-500 uppercase tracking-wider mb-4 font-label">Détails de la transaction</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-500 font-body">Référence</span>
                <span className="text-sm font-mono font-semibold text-foreground-800">{transaction.reference}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-500 font-body">Date</span>
                <span className="text-sm font-medium text-foreground-700 font-body">{formattedDate} à {formattedHeure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-500 font-body">Montant</span>
                <span className="text-lg font-bold font-heading text-foreground-950">{transaction.montant.toLocaleString('fr-FR')} <span className="text-sm font-normal text-foreground-500">FCFA</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-500 font-body">Mode de paiement</span>
                <span className="text-sm font-medium text-foreground-700 font-body">
                  <i className="ri-bank-card-line w-4 h-4 inline-flex items-center justify-center mr-1"></i>
                  {modeLabel} •••• {transaction.derniersChiffres}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-500 font-body">Statut</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold font-label">
                  <i className="ri-check-double-line w-3 h-3 flex items-center justify-center"></i>
                  Confirmé
                </span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/candidat/tableau-de-bord"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
            >
              <i className="ri-folder-user-line w-4 h-4 flex items-center justify-center"></i>
              Mon dossier
            </Link>
            <button
              onClick={generatePDF}
              disabled={isDownloading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-background-100 text-foreground-700 text-sm font-semibold hover:bg-background-200 transition-all cursor-pointer whitespace-nowrap font-label disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                  Génération...
                </>
              ) : (
                <>
                  <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                  Télécharger le reçu PDF
                </>
              )}
            </button>
          </div>

          {/* Auto-redirect */}
          <p className="text-xs text-foreground-400 mt-6 font-body">
            Redirection automatique vers votre dossier dans <strong className="text-foreground-600">{countdown}s</strong>
          </p>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-1.5">
            <i className="ri-lock-line text-foreground-400 w-3.5 h-3.5 flex items-center justify-center"></i>
            <span className="text-xs text-foreground-400 font-body">Crypté SSL</span>
          </div>
          <span className="text-foreground-300">|</span>
          <span className="text-xs text-foreground-400 font-body">Propulsé par Stripe</span>
        </div>
      </div>
    </div>
  );
}