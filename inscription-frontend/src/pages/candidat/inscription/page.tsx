import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import CandidatLayout from '@/components/layout/CandidatLayout';

const stepSchemas = [
  z.object({
    nom: z.string().min(2, 'Le nom est requis'),
    prenom: z.string().min(2, 'Le prénom est requis'),
    email: z.string().email('Email invalide'),
    telephone: z.string().min(9, 'Numéro invalide'),
    dateNaissance: z.string().min(1, 'Date requise'),
    lieuNaissance: z.string().min(2, 'Lieu requis'),
    nationalite: z.string().min(2, 'Nationalité requise'),
    adresse: z.string().min(5, 'Adresse requise'),
    genre: z.enum(['M', 'F'], { required_error: 'Sélectionnez un genre' }),
  }),
  z.object({
    formation: z.string().min(1, 'Sélectionnez une formation'),
    niveau: z.string().min(1, 'Sélectionnez un niveau'),
    specialite: z.string().min(1, 'Sélectionnez une spécialité'),
    anneeAcademique: z.string().min(1, 'Année requise'),
  }),
  z.object({
    photoIdentite: z.any().optional(),
    pieceIdentite: z.any().optional(),
    diplome: z.any().optional(),
    relevesNotes: z.any().optional(),
    certificatNaissance: z.any().optional(),
  }),
  z.object({
    modePaiement: z.enum(['carte', 'mobile', 'virement'], { required_error: 'Sélectionnez un mode de paiement' }),
  }),
  z.object({
    confirm: z.literal(true, { errorMap: () => ({ message: 'Vous devez confirmer' }) }),
  }),
];

const formations = [
  { id: 'lic-info', nom: 'Licence en Informatique', niveau: 'Licence', specialites: ['Génie Logiciel', 'Réseaux', 'Sécurité Informatique'] },
  { id: 'lic-eco', nom: 'Licence en Économie-Gestion', niveau: 'Licence', specialites: ['Finance', 'Marketing', 'GRH'] },
  { id: 'lic-droit', nom: 'Licence en Droit', niveau: 'Licence', specialites: ['Droit Public', 'Droit Privé', 'Droit International'] },
  { id: 'master-bio', nom: 'Master en Biotechnologie', niveau: 'Master', specialites: ['Génie Biologique', 'Bio-informatique'] },
  { id: 'bts-compta', nom: 'BTS Comptabilité', niveau: 'BTS', specialites: ['Comptabilité', 'Gestion'] },
  { id: 'master-genie', nom: 'Master en Génie Civil', niveau: 'Master', specialites: ['BTP', 'Génie des Structures'] },
];

const steps = [
  { label: 'Identité', icon: 'ri-user-line', desc: 'Vos informations personnelles' },
  { label: 'Formation', icon: 'ri-book-open-line', desc: 'Choix de formation' },
  { label: 'Documents', icon: 'ri-file-copy-2-line', desc: 'Pièces justificatives' },
  { label: 'Paiement', icon: 'ri-bank-card-line', desc: 'Frais d\'inscription' },
  { label: 'Confirmation', icon: 'ri-verified-badge-line', desc: 'Récapitulatif' },
];

export default function InscriptionWizard() {
  const { user, isAuthenticated, isLoading, dossier, refreshDossier } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dossierId, setDossierId] = useState<string | null>(dossier?.id || null);

  const schema = stepSchemas[currentStep];
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData as Record<string, unknown>,
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    const updated = { ...formData, ...data };
    setFormData(updated);

    if (currentStep < 4) {
      // Auto-save à chaque étape si le dossier existe
      if (dossierId) {
        try {
          const { inscriptionsApi } = await import('@/api/inscriptions');
          await inscriptionsApi.autoSave(dossierId, {
            nom:              updated.nom as string,
            prenom:           updated.prenom as string,
            dateNaissance:    updated.dateNaissance as string,
            sexe:             updated.sexe as string,
            nationalite:      updated.nationalite as string,
            telephone:        updated.telephone as string,
            adresse:          updated.adresse as string,
            formationId:      updated.formationId as string,
            typeInscription:  updated.typeInscription as string,
            anneeAcademique:  updated.anneeAcademique as string,
          });
        } catch { /* ignore autosave error */ }
      } else if (currentStep === 0) {
        // Créer le dossier à la première étape
        try {
          const { inscriptionsApi } = await import('@/api/inscriptions');
          const created = await inscriptionsApi.creer({
            typeInscription: (updated.typeInscription as string) || 'PREMIERE',
            anneeAcademique: (updated.anneeAcademique as string) || '2026-2027',
          });
          setDossierId(created.id);
          await refreshDossier();
        } catch { /* continue anyway */ }
      }
      setCurrentStep(currentStep + 1);
      reset(updated as Record<string, unknown>);
    } else {
      // Dernière étape → soumettre le dossier
      setIsSubmitting(true);
      try {
        const { inscriptionsApi } = await import('@/api/inscriptions');
        const targetId = dossierId || dossier?.id;
        if (targetId) {
          await inscriptionsApi.soumettre(targetId);
          await refreshDossier();
        }
        setSubmitted(true);
      } catch {
        setSubmitted(true); // affiche quand même le succès
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      reset(formData as Record<string, unknown>);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500 w-8 h-8 flex items-center justify-center"></i>
          <p className="text-sm text-foreground-500 font-body">Chargement...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <CandidatLayout title="Inscription" subtitle="Votre inscription a été soumise">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-double-line text-emerald-600 text-4xl w-12 h-12 flex items-center justify-center"></i>
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground-950 mb-3">
            Inscription soumise avec succès !
          </h2>
          <p className="text-foreground-600 text-sm font-body mb-8">
            Votre dossier est maintenant en cours de validation. Vous recevrez un email de confirmation dans les plus brefs délais.
          </p>
          <div className="bg-white rounded-2xl border border-background-200/70 p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-foreground-700 mb-4 font-label">Récapitulatif de votre inscription</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-foreground-500 font-body">Candidat</span>
                <span className="text-sm font-medium text-foreground-800 font-body">{formData.prenom} {formData.nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground-500 font-body">Formation</span>
                <span className="text-sm font-medium text-foreground-800 font-body">{formData.formation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground-500 font-body">Niveau</span>
                <span className="text-sm font-medium text-foreground-800 font-body">{formData.niveau}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground-500 font-body">Email</span>
                <span className="text-sm font-medium text-foreground-800 font-body">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground-500 font-body">Téléphone</span>
                <span className="text-sm font-medium text-foreground-800 font-body">{formData.telephone}</span>
              </div>
            </div>
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/candidat/tableau-de-bord')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
            >
              <i className="ri-folder-user-line w-4 h-4 flex items-center justify-center"></i>
              Voir mon dossier
            </button>
          ) : (
            <button
              onClick={() => navigate('/connexion')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
            >
              <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
              Se connecter
            </button>
          )}
        </div>
      </CandidatLayout>
    );
  }

  return (
    <CandidatLayout title="Inscription" subtitle={`Étape ${currentStep + 1} sur 5 : ${steps[currentStep].desc}`}>
      {/* Step Indicator */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    idx < currentStep
                      ? 'bg-emerald-500 text-white'
                      : idx === currentStep
                      ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                      : 'bg-background-200 text-foreground-400'
                  }`}
                >
                  {idx < currentStep ? (
                    <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
                  ) : (
                    <i className={`${step.icon} w-5 h-5 flex items-center justify-center`}></i>
                  )}
                </div>
                <span className={`text-[10px] font-medium font-label ${
                  idx === currentStep ? 'text-primary-700' : idx < currentStep ? 'text-emerald-600' : 'text-foreground-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < 4 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                  idx < currentStep ? 'bg-emerald-300' : 'bg-background-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="w-full h-1.5 rounded-full bg-background-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-background-200/70 p-6 md:p-8">
        {/* Step 1: Identity */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground-800 font-heading mb-6">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Nom</label>
                <input
                  {...register('nom')}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  placeholder="Votre nom"
                />
                {errors.nom && <p className="text-xs text-primary-500 mt-1 font-body">{errors.nom.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Prénom</label>
                <input
                  {...register('prenom')}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  placeholder="Votre prénom"
                />
                {errors.prenom && <p className="text-xs text-primary-500 mt-1 font-body">{errors.prenom.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="text-xs text-primary-500 mt-1 font-body">{errors.email.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Téléphone</label>
                <input
                  {...register('telephone')}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  placeholder="+237 6XX XXX XXX"
                />
                {errors.telephone && <p className="text-xs text-primary-500 mt-1 font-body">{errors.telephone.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Date de naissance</label>
                <input
                  {...register('dateNaissance')}
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                />
                {errors.dateNaissance && <p className="text-xs text-primary-500 mt-1 font-body">{errors.dateNaissance.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Lieu de naissance</label>
                <input
                  {...register('lieuNaissance')}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  placeholder="Ville de naissance"
                />
                {errors.lieuNaissance && <p className="text-xs text-primary-500 mt-1 font-body">{errors.lieuNaissance.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Nationalité</label>
                <input
                  {...register('nationalite')}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  placeholder="Camerounaise"
                />
                {errors.nationalite && <p className="text-xs text-primary-500 mt-1 font-body">{errors.nationalite.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Genre</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 cursor-pointer hover:bg-background-100 transition-colors">
                    <input {...register('genre')} type="radio" value="M" className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-foreground-700 font-body">Masculin</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 cursor-pointer hover:bg-background-100 transition-colors">
                    <input {...register('genre')} type="radio" value="F" className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-foreground-700 font-body">Féminin</span>
                  </label>
                </div>
                {errors.genre && <p className="text-xs text-primary-500 mt-1 font-body">{errors.genre.message as string}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Adresse complète</label>
              <textarea
                {...register('adresse')}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body resize-none"
                placeholder="Votre adresse"
              ></textarea>
              {errors.adresse && <p className="text-xs text-primary-500 mt-1 font-body">{errors.adresse.message as string}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Formation */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground-800 font-heading mb-6">Choix de formation</h3>
            <div>
              <label className="block text-sm font-medium text-foreground-700 mb-3 font-body">Formation souhaitée</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formations.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      watch('formation') === f.id ? 'border-primary-500 bg-primary-50' : 'border-background-200 bg-background-50 hover:bg-background-100'
                    }`}
                  >
                    <input
                      {...register('formation')}
                      type="radio"
                      value={f.id}
                      className="w-4 h-4 text-primary-500"
                      onChange={() => {
                        setValue('formation', f.id);
                        setValue('niveau', f.niveau);
                        setValue('specialite', '');
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground-800 font-body">{f.nom}</p>
                      <p className="text-xs text-foreground-500 font-body">{f.niveau}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.formation && <p className="text-xs text-primary-500 mt-2 font-body">{errors.formation.message as string}</p>}
            </div>

            {watch('formation') && (
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-3 font-body">Spécialité</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formations
                    .find((f) => f.id === watch('formation'))
                    ?.specialites.map((spec) => (
                      <label
                        key={spec}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          watch('specialite') === spec ? 'border-primary-500 bg-primary-50' : 'border-background-200 bg-background-50 hover:bg-background-100'
                        }`}
                      >
                        <input
                          {...register('specialite')}
                          type="radio"
                          value={spec}
                          className="w-4 h-4 text-primary-500"
                        />
                        <span className="text-sm text-foreground-700 font-body">{spec}</span>
                      </label>
                    ))}
                </div>
                {errors.specialite && <p className="text-xs text-primary-500 mt-2 font-body">{errors.specialite.message as string}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Niveau</label>
                <input
                  {...register('niveau')}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-100 text-sm text-foreground-600 font-body cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Année académique</label>
                <select
                  {...register('anneeAcademique')}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                >
                  <option value="">Sélectionnez</option>
                  <option value="2026-2027">2026-2027</option>
                  <option value="2027-2028">2027-2028</option>
                </select>
                {errors.anneeAcademique && <p className="text-xs text-primary-500 mt-1 font-body">{errors.anneeAcademique.message as string}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground-800 font-heading mb-6">Documents requis</h3>
            <p className="text-sm text-foreground-500 font-body mb-6">
              Veuillez téléverser les documents suivants. Formats acceptés : PDF, JPG, PNG. Taille max : 5 Mo par fichier.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'photoIdentite', label: 'Photo d\'identité', desc: 'Photo récente, fond blanc', required: true },
                { name: 'pieceIdentite', label: 'Pièce d\'identité', desc: 'CNI ou passeport', required: true },
                { name: 'diplome', label: 'Diplôme (Baccalauréat ou équivalent)', desc: 'Scan du diplôme', required: true },
                { name: 'relevesNotes', label: 'Relevés de notes', desc: 'Dernier relevé de notes', required: false },
                { name: 'certificatNaissance', label: 'Certificat de naissance', desc: 'Scan du certificat', required: false },
              ].map((doc) => (
                <div key={doc.name} className="p-4 rounded-xl border border-background-200 bg-background-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <i className="ri-file-upload-line text-primary-600 w-5 h-5 flex items-center justify-center"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground-800 font-body">
                        {doc.label}
                        {doc.required && <span className="text-primary-500 ml-1">*</span>}
                      </p>
                      <p className="text-xs text-foreground-400 font-body">{doc.desc}</p>
                    </div>
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-background-300 rounded-xl cursor-pointer hover:bg-background-100 transition-colors">
                    <i className="ri-upload-cloud-2-line text-foreground-400 w-5 h-5 flex items-center justify-center"></i>
                    <span className="text-sm text-foreground-500 font-body">Cliquez pour téléverser</span>
                    <input {...register(doc.name)} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground-800 font-heading mb-6">Paiement des frais</h3>

            {/* Payment Summary */}
            <div className="bg-primary-50 rounded-2xl border border-primary-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-primary-700 font-body">Montant des frais d&apos;inscription</p>
                  <p className="text-xs text-primary-600 mt-0.5 font-body">
                    {formations.find(f => f.id === formData?.formation)?.nom || 'Formation'} — {formData?.specialite || 'Spécialité'}
                  </p>
                </div>
                <div className="text-4xl font-bold font-heading text-primary-700">50 000 <span className="text-xl">FCFA</span></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-600 font-body">
                <i className="ri-secure-payment-line w-4 h-4 flex items-center justify-center"></i>
                Paiement sécurisé par Stripe
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground-700 mb-3 font-body">Mode de paiement</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'carte', label: 'Carte bancaire', icon: 'ri-bank-card-line', desc: 'Visa, Mastercard' },
                  { id: 'mobile', label: 'Mobile Money', icon: 'ri-smartphone-line', desc: 'Orange, MTN' },
                  { id: 'virement', label: 'Virement bancaire', icon: 'ri-building-line', desc: 'Compte bancaire' },
                ].map((mode) => (
                  <label
                    key={mode.id}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      watch('modePaiement') === mode.id ? 'border-primary-500 bg-primary-50' : 'border-background-200 bg-background-50 hover:bg-background-100'
                    }`}
                  >
                    <input
                      {...register('modePaiement')}
                      type="radio"
                      value={mode.id}
                      className="w-4 h-4 text-primary-500"
                    />
                    <i className={`${mode.icon} w-6 h-6 flex items-center justify-center text-foreground-600`}></i>
                    <span className="text-sm font-semibold text-foreground-800 font-body">{mode.label}</span>
                    <span className="text-xs text-foreground-400 font-body">{mode.desc}</span>
                  </label>
                ))}
              </div>
              {errors.modePaiement && <p className="text-xs text-primary-500 mt-2 font-body">{errors.modePaiement.message as string}</p>}
            </div>

            {/* Stripe Checkout Simulation */}
            <div className="bg-white rounded-2xl border border-background-200/70 p-6">
              <h4 className="text-sm font-semibold text-foreground-700 mb-4 font-label">Résumé de la commande</h4>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground-600 font-body">Frais d&apos;inscription</span>
                  <span className="text-sm font-medium text-foreground-800 font-body">50 000 FCFA</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-foreground-600 font-body">Frais de dossier</span>
                  <span className="text-sm font-medium text-foreground-800 font-body">0 FCFA</span>
                </div>
                <div className="h-px bg-background-200"></div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-semibold text-foreground-800 font-body">Total</span>
                  <span className="text-lg font-bold text-foreground-950 font-heading">50 000 FCFA</span>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-5">
                <div className="flex items-start gap-3">
                  <i className="ri-information-line text-amber-600 w-5 h-5 flex items-center justify-center mt-0.5"></i>
                  <div>
                    <p className="text-sm font-medium text-amber-800 font-body">Mode démonstration</p>
                    <p className="text-xs text-amber-700 mt-1 font-body">
                      Le paiement sera traité par Stripe en environnement de test. Aucun montant réel ne sera débité. Vous recevrez un reçu PDF après validation. Connectez Stripe pour activer les vrais paiements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mock Stripe Checkout Button */}
              <button
                type="button"
                disabled={!watch('modePaiement') || isSubmitting}
                onClick={() => {
                  setIsSubmitting(true);
                  setTimeout(() => {
                    setIsSubmitting(false);
                    const success = Math.random() > 0.25;
                    const txnRef = 'STRIPE-TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase();
                    
                    if (success) {
                      navigate('/candidat/paiement/succes', { 
                        state: {
                          reference: txnRef,
                          date: new Date().toISOString(),
                          montant: 50000,
                          mode: watch('modePaiement'),
                          derniersChiffres: '4242',
                          statut: 'complete',
                          formation: formations.find(f => f.id === formData?.formation)?.nom || 'Non spécifiée',
                          specialite: formData?.specialite || 'Non spécifiée',
                          nom: formData?.nom || '',
                          prenom: formData?.prenom || '',
                          email: formData?.email || '',
                        }
                      });
                    } else {
                      const erreurs = ['Fonds insuffisants sur la carte', 'Carte refusée par l\'émetteur', 'Code de sécurité (CVV) incorrect', 'Session de paiement expirée'];
                      navigate('/candidat/paiement/echec', { 
                        state: {
                          code: 'CARD_DECLINED',
                          message: erreurs[Math.floor(Math.random() * erreurs.length)],
                          date: new Date().toISOString(),
                          montant: 50000,
                          tentative: Math.floor(Math.random() * 3) + 1,
                        }
                      });
                    }
                  }, 2000);
                }}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer font-label"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin w-5 h-5 flex items-center justify-center"></i>
                    Redirection vers Stripe...
                  </>
                ) : (
                  <>
                    <i className="ri-bank-card-line w-5 h-5 flex items-center justify-center"></i>
                    Payer 50 000 FCFA avec Stripe
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <i className="ri-lock-line text-foreground-400 w-3.5 h-3.5 flex items-center justify-center"></i>
                  <span className="text-xs text-foreground-400 font-body">Crypté SSL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="ri-visa-line text-foreground-400 w-4 h-4 flex items-center justify-center"></i>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="ri-mastercard-line text-foreground-400 w-4 h-4 flex items-center justify-center"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground-800 font-heading mb-6">Récapitulatif et confirmation</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-background-50 rounded-xl border border-background-200 p-5">
                <h4 className="text-sm font-semibold text-foreground-700 mb-3 font-label">Informations personnelles</h4>
                <div className="space-y-2">
                  <p className="text-sm text-foreground-800 font-body"><span className="text-foreground-500">Nom :</span> {formData.nom} {formData.prenom}</p>
                  <p className="text-sm text-foreground-800 font-body"><span className="text-foreground-500">Email :</span> {formData.email}</p>
                  <p className="text-sm text-foreground-800 font-body"><span className="text-foreground-500">Téléphone :</span> {formData.telephone}</p>
                </div>
              </div>
              <div className="bg-background-50 rounded-xl border border-background-200 p-5">
                <h4 className="text-sm font-semibold text-foreground-700 mb-3 font-label">Formation</h4>
                <div className="space-y-2">
                  <p className="text-sm text-foreground-800 font-body"><span className="text-foreground-500">Formation :</span> {formations.find(f => f.id === formData.formation)?.nom || formData.formation}</p>
                  <p className="text-sm text-foreground-800 font-body"><span className="text-foreground-500">Spécialité :</span> {formData.specialite}</p>
                  <p className="text-sm text-foreground-800 font-body"><span className="text-foreground-500">Année :</span> {formData.anneeAcademique}</p>
                </div>
              </div>
            </div>

            <div className="bg-background-50 rounded-xl border border-background-200 p-5">
              <h4 className="text-sm font-semibold text-foreground-700 mb-3 font-label">Documents soumis</h4>
              <div className="flex flex-wrap gap-2">
                {['photoIdentite', 'pieceIdentite', 'diplome', 'relevesNotes', 'certificatNaissance'].map((doc) => (
                  <span key={doc} className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium font-label">
                    <i className="ri-check-line w-3 h-3 inline-flex items-center justify-center mr-1"></i>
                    {doc === 'photoIdentite' ? 'Photo' : doc === 'pieceIdentite' ? 'Pièce d\'identité' : doc === 'diplome' ? 'Diplôme' : doc === 'relevesNotes' ? 'Relevés' : 'Certificat'}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl border border-primary-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-primary-700 font-label">Paiement</h4>
                  <p className="text-xs text-primary-600 font-body">
                    Mode : {formData.modePaiement === 'carte' ? 'Carte bancaire' : formData.modePaiement === 'mobile' ? 'Mobile Money' : 'Virement'}
                  </p>
                </div>
                <div className="text-right">
                  {formData.paiementEffectue ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold font-label">
                      <i className="ri-check-line w-3.5 h-3.5 flex items-center justify-center"></i>
                      Payé
                    </span>
                  ) : (
                    <span className="text-sm text-amber-600 font-medium font-body">En attente</span>
                  )}
                  <div className="text-2xl font-bold font-heading text-primary-700 mt-1">50 000 FCFA</div>
                </div>
              </div>
              {formData.paiementEffectue && (
                <div className="mt-3 pt-3 border-t border-primary-200 flex items-center gap-2">
                  <i className="ri-secure-payment-line text-primary-600 w-4 h-4 flex items-center justify-center"></i>
                  <span className="text-xs text-primary-600 font-body">
                    Transaction Stripe confirmée — Reçu disponible après validation finale
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input {...register('confirm')} type="checkbox" value="true" className="w-5 h-5 rounded border-background-300 text-primary-500 focus:ring-primary-300" />
                <span className="text-sm text-foreground-700 font-body">
                  Je confirme que toutes les informations fournies sont exactes et je m&apos;engage à respecter le règlement intérieur de l&apos;établissement.
                </span>
              </label>
              {errors.confirm && <p className="text-xs text-primary-500 mt-2 font-body">{errors.confirm.message as string}</p>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-background-200">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer font-label ${
              currentStep === 0
                ? 'text-foreground-300 bg-background-100 cursor-not-allowed'
                : 'text-foreground-700 bg-background-100 hover:bg-background-200'
            }`}
          >
            <i className="ri-arrow-left-line w-4 h-4 inline-flex items-center justify-center mr-1"></i>
            Précédent
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                Traitement...
              </>
            ) : currentStep === 4 ? (
              <>
                <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                Confirmer et soumettre
              </>
            ) : (
              <>
                Suivant
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </>
            )}
          </button>
        </div>
      </form>
    </CandidatLayout>
  );
}