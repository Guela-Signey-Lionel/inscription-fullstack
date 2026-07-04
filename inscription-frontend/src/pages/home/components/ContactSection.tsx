import { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitStatus !== 'idle') setSubmitStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.message.length > 500) {
      setErrorMessage('Le message ne doit pas dépasser 500 caractères.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const body = new URLSearchParams();
      body.append('nom', formData.nom);
      body.append('email', formData.email);
      body.append('sujet', formData.sujet);
      body.append('message', formData.message);

      const response = await fetch('https://readdy.ai/api/form/d8kne47jf7p243ot2of0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ nom: '', email: '', sujet: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-background-100 py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-accent-600 font-label mb-4">
            Contact
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground-950 leading-tight">
            Une question ?
            <br />
            <span className="italic text-accent-600">Écrivez-nous</span>
          </h2>
          <p className="mt-4 text-foreground-600 text-sm md:text-base font-body leading-relaxed">
            Notre équipe administrative est à votre écoute. Nous répondons sous 24 à 48 heures ouvrées.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-background-50 border border-background-200/70">
              <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-mail-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground-950 font-heading mb-1">Email</h3>
                <p className="text-xs text-foreground-500 font-body">signeylguela@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-background-50 border border-background-200/70">
              <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-phone-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground-950 font-heading mb-1">Téléphone</h3>
                <p className="text-xs text-foreground-500 font-body">+236 72 90 33 59</p>
                <p className="text-xs text-foreground-500 font-body">+237 68 77 89 930</p>
                <p className="text-xs text-foreground-400 font-body mt-1">Lun-Ven · 8h-17h</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-background-50 border border-background-200/70">
              <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-map-pin-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground-950 font-heading mb-1">Adresse</h3>
                <p className="text-xs text-foreground-500 font-body leading-relaxed">
                  Institut PKFokam, Quartier Emana
                  <br />
                  Yaoundé, Cameroun
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-background-50 border border-background-200/70">
              <div className="w-11 h-11 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-time-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground-950 font-heading mb-1">Horaires d&apos;ouverture</h3>
                <p className="text-xs text-foreground-500 font-body">Lundi - Vendredi : 8h00 - 17h00</p>
                <p className="text-xs text-foreground-500 font-body">Samedi : 9h00 - 13h00</p>
                <p className="text-xs text-foreground-500 font-body">Dimanche : Fermé</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-background-50 border border-background-200/70 rounded-2xl p-6 md:p-8">
              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-5">
                    <i className="ri-check-line text-accent-600 text-2xl w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground-950 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-sm text-foreground-500 font-body max-w-sm mx-auto">
                    Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-all cursor-pointer whitespace-nowrap font-label"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-readdy-form id="contact-form">
                  {errorMessage && (
                    <div className="mb-5 p-3 rounded-xl bg-primary-50 border border-primary-200 flex items-start gap-2.5">
                      <i className="ri-error-warning-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center mt-0.5"></i>
                      <p className="text-xs text-primary-700 font-body">{errorMessage}</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-5 p-3 rounded-xl bg-primary-50 border border-primary-200 flex items-start gap-2.5">
                      <i className="ri-error-warning-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center mt-0.5"></i>
                      <p className="text-xs text-primary-700 font-body">{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="contact-nom"
                        className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                      >
                        Nom complet
                      </label>
                      <div className="relative">
                        <i className="ri-user-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                        <input
                          id="contact-nom"
                          name="nom"
                          type="text"
                          value={formData.nom}
                          onChange={handleChange}
                          placeholder="Votre nom"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all font-body"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                      >
                        Adresse email
                      </label>
                      <div className="relative">
                        <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="vous@exemple.fr"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all font-body"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="contact-sujet"
                      className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                    >
                      Sujet
                    </label>
                    <div className="relative">
                      <i className="ri-chat-3-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                      <select
                        id="contact-sujet"
                        name="sujet"
                        value={formData.sujet}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all font-body cursor-pointer appearance-none"
                        required
                      >
                        <option value="" disabled>Sélectionnez un sujet</option>
                        <option value="inscription">Inscription &amp; admission</option>
                        <option value="documents">Documents &amp; pièces justificatives</option>
                        <option value="paiement">Paiement &amp; frais</option>
                        <option value="technique">Problème technique</option>
                        <option value="formations">Formations &amp; programmes</option>
                        <option value="autre">Autre demande</option>
                      </select>
                      <i className="ri-arrow-down-s-line absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm pointer-events-none w-4 h-4 flex items-center justify-center"></i>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre demande..."
                      rows={5}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all font-body resize-none"
                      required
                    ></textarea>
                    <div className="flex justify-between items-center mt-1.5">
                      <p className="text-[11px] text-foreground-400 font-body">
                        Maximum 500 caractères
                      </p>
                      <p className={`text-[11px] font-body ${formData.message.length > 500 ? 'text-primary-500' : 'text-foreground-400'}`}>
                        {formData.message.length}/500
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || formData.message.length > 500}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 focus:ring-4 focus:ring-accent-200 transition-all cursor-pointer whitespace-nowrap font-label disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center"></i>
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Geolocation - Yaoundé, Quartier Emana */}
        <div className="mt-12 md:mt-16">
          <div className="rounded-2xl overflow-hidden border border-background-200/70">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.876543210!2d11.500000!3d3.866667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNTInMDAuMCJOIDExwrAzMCcwMC4wIkU!5e0!3m2!1sfr!2scm!4v1700000000000!5m2!1sfr!2scm"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Institut PKFokam — Quartier Emana, Yaoundé"
              className="w-full"
            ></iframe>
          </div>
          <p className="text-xs text-foreground-400 font-body mt-3 text-center">
            <i className="ri-map-pin-line text-xs w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
            Institut PKFokam · Quartier Emana · Yaoundé, Cameroun
          </p>
        </div>
      </div>
    </section>
  );
}