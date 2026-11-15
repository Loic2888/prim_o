/**
 * pages/Confidentialite.tsx — Public privacy policy ("Politique de confidentialité") page.
 *
 * Mirrors the processing register kept in documentation/registre-traitements.md and article 12
 * of the CGU: who is responsible, which data is collected and why, who receives it, how long it
 * is kept, how rights are exercised. Content is statically defined in the `sections` array and
 * rendered with the same classes as the CGU page. The route is public (readable before sign-up)
 * and indexable.
 */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const LAST_UPDATE = '15 novembre 2026';

const sections: { num: number; title: string; content: string }[] = [
  {
    num: 1,
    title: 'Qui est responsable de vos données',
    content:
      "Le responsable du traitement est PRIM'O SAS, représentée par Loïc Cerqueira.\n\nPour toute question sur vos données, écrivez à support@primo.app.",
  },
  {
    num: 2,
    title: 'Les données que nous collectons',
    content:
      "Données de compte : nom, prénom, adresse email, mot de passe (stocké chiffré, jamais en clair), rôle (employé, manager, employeur), entreprise, date d'entrée et avatar.\n\nDonnées d'activité : tokens reçus et distribués avec leur motif, rachats de bons d'achat, favoris, équipe de rattachement.\n\nDonnées de paiement (employeurs) : le paiement est traité par Stripe. Les numéros de carte ne transitent jamais par nos serveurs et ne sont pas conservés par PRIM'O.",
  },
  {
    num: 3,
    title: 'Pourquoi nous les utilisons',
    content:
      "Gérer votre compte et vous authentifier (exécution du contrat).\n\nAttribuer, distribuer et échanger des tokens contre des bons d'achat (exécution du contrat).\n\nEncaisser les abonnements des employeurs et tenir la comptabilité (exécution du contrat et obligation légale).\n\nSécuriser la plateforme et prévenir la fraude (intérêt légitime).\n\nNous n'utilisons pas vos données à des fins publicitaires et nous ne les vendons pas.",
  },
  {
    num: 4,
    title: 'Qui y a accès',
    content:
      "Au sein de votre entreprise : votre employeur voit votre profil, votre solde et les tokens qu'il vous attribue. Votre manager voit les membres de son équipe et les tokens qu'il leur distribue. Si votre employeur active le fil d'actualité, vos collègues voient les tokens reçus dans l'entreprise avec leur motif.\n\nPRIM'O : l'équipe d'administration de la plateforme.\n\nSous-traitants : Stripe (paiement), Render (hébergement de l'API et de la base de données ; la base est hébergée à Francfort, dans l'Union européenne) et Vercel (diffusion des fichiers de l'application ; aucune donnée de compte n'y est stockée).\n\nLes données d'une entreprise ne sont jamais visibles par une autre entreprise.",
  },
  {
    num: 5,
    title: 'Combien de temps nous les conservons',
    content:
      "Vos données personnelles sont conservées tant que votre compte est actif.\n\nLorsque votre compte est supprimé, vos nom, prénom, adresse email, mot de passe et favoris sont effacés immédiatement. Les enregistrements comptables (attributions de tokens, rachats) sont conservés sans lien avec votre identité, sauf obligation légale contraire.",
  },
  {
    num: 6,
    title: 'Vos droits',
    content:
      "Accès, rectification : depuis les pages « Mes informations » et « Profil », ou par email.\n\nEffacement : bouton « Supprimer mon compte » dans « Paramètres ».\n\nPortabilité : bouton « Télécharger mes données » dans « Paramètres » (fichier JSON).\n\nLimitation et opposition : par email à support@primo.app.\n\nSi vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (www.cnil.fr).",
  },
  {
    num: 7,
    title: 'Cookies et stockage local',
    content:
      "PRIM'O n'utilise aucun cookie publicitaire ni outil de mesure d'audience. Le navigateur conserve uniquement ce qui est nécessaire au fonctionnement : votre session de connexion, votre panier et vos préférences d'affichage.",
  },
  {
    num: 8,
    title: 'Sécurité',
    content:
      "Mots de passe chiffrés, échanges protégés par HTTPS, accès limité par rôle et cloisonné par entreprise, paiements délégués à Stripe. En cas de violation de données présentant un risque pour vous, nous vous en informons et nous prévenons la CNIL dans les délais légaux.",
  },
];

export default function Confidentialite() {
  usePageMeta({
    title: "Politique de confidentialité | PRIM'O",
    description:
      "Quelles données PRIM'O collecte, pourquoi, qui y a accès, combien de temps elles sont conservées et comment exercer vos droits.",
    indexable: true,
    canonicalPath: '/confidentialite',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <div>
      <div className="faq-topbar faq-topbar--clean" style={{ justifyContent: 'space-between' }}>
        <h1 className="faq-topbar-title">Politique de confidentialité</h1>
        <button className="back-btn" onClick={() => (from ? navigate(from) : navigate(-1))}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour
        </button>
      </div>

      <div className="cgu-content">
        <p className="cgu-update">Dernière mise à jour : {LAST_UPDATE}</p>
        <p className="cgu-intro">
          Cette page explique, simplement, ce que PRIM'O fait de vos données personnelles. Elle complète l'article 12 des{' '}
          <Link to="/cgu">Conditions Générales d'Utilisation</Link>.
        </p>

        {sections.map((section) => (
          <div key={section.num} className="cgu-article">
            <h2 className="cgu-article-title">
              {section.num}. {section.title}
            </h2>
            <div className="cgu-article-body">
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}

        <div className="cgu-footer">
          <p>
            Une question ? <a href="mailto:support@primo.app">support@primo.app</a>
          </p>
        </div>
      </div>
    </div>
  );
}
