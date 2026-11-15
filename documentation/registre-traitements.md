# Registre des activités de traitement — PRIM'O

> Document interne (article 30 du RGPD). Mis à jour le 15/11/2026.
> Il doit rester cohérent avec l'article 12 des CGU (`client/src/pages/CGU.tsx`) et avec la page publique `/confidentialite`.

## Responsable du traitement

| | |
|---|---|
| **Responsable** | PRIM'O SAS, représentée par Loïc Cerqueira |
| **Contact** | support@primo.app |
| **Délégué à la protection des données** | Non désigné (non obligatoire pour ce volume et ce type de traitement) |

## Sous-traitants

| Sous-traitant | Rôle | Données concernées | Localisation | Statut du contrat |
|---|---|---|---|---|
| **Render** | Hébergement de l'API Node.js et de la base PostgreSQL | Toutes les données de l'application | Base : région Francfort (Union européenne). Service API : région à confirmer dans le tableau de bord | À confirmer : accord de traitement (DPA) accepté dans le compte Render |
| **Vercel** | Diffusion des fichiers statiques du front (React) | Aucune donnée de compte : seuls les fichiers de l'application et les journaux d'accès techniques | États-Unis par défaut | À confirmer : DPA accepté dans le compte Vercel |
| **Stripe** | Encaissement des abonnements des employeurs | Identité de l'employeur et de l'entreprise, données de carte (saisies uniquement dans Stripe.js) | Union européenne et États-Unis | À confirmer : DPA Stripe accepté |

La base `primo-db` a été recréée à Francfort le 13/11/2026. La région du service `primo-api` n'a pas été vérifiée : voir T-96 (`region: frankfurt` dans `render.yaml`).

## Traitement 1 — Comptes utilisateurs

| Rubrique | Contenu |
|---|---|
| **Finalité** | Créer et gérer les comptes, authentifier, appliquer les rôles (employé, manager, employeur, administrateur) |
| **Base légale** | Exécution du contrat (CGU) |
| **Personnes concernées** | Employés, managers, employeurs, administrateurs |
| **Données** | Nom, prénom, adresse email, mot de passe (hash bcrypt, 12 tours), rôle, statut, date d'entrée, avatar, entreprise de rattachement, solde de tokens |
| **Destinataires** | L'employeur et l'administrateur voient les profils de leur entreprise ; le manager voit son équipe ; Render (hébergement) |
| **Durée de conservation** | Pendant la durée d'activité du compte. À la suppression : effacement immédiat de la ligne `users` |
| **Mesures de sécurité** | Hash bcrypt, jamais renvoyé par l'API (`password_hash` exclu par défaut), JWT en variables d'environnement, rôles et cloisonnement par entreprise (`company_id`, `teamScope`), limitation des tentatives de connexion, HTTPS |
| **Transferts hors UE** | Aucun pour la base (Francfort) ; région du service API à confirmer |
| **Droits** | Accès et rectification (pages « Profil » et « Mes informations »), effacement (« Supprimer mon compte »), portabilité (`GET /api/users/me/export`, bouton « Télécharger mes données »), limitation et opposition (email) |

## Traitement 2 — Transactions de tokens

| Rubrique | Contenu |
|---|---|
| **Finalité** | Attribuer et distribuer des tokens, afficher l'historique et le fil d'actualité de l'entreprise, tenir une trace comptable |
| **Base légale** | Exécution du contrat ; obligation légale pour la comptabilité |
| **Personnes concernées** | Employeurs, managers, employés |
| **Données** | Émetteur, bénéficiaire, montant, type, motif, date, entreprise |
| **Destinataires** | Émetteur et bénéficiaire ; l'employeur de l'entreprise ; les collègues si l'employeur active le fil d'actualité (tokens reçus et motif) |
| **Durée de conservation** | Sans limite de durée pour les enregistrements comptables, **sans lien avec l'identité** après suppression du compte (`sender_id` et `receiver_id` passent à `NULL`) |
| **Mesures de sécurité** | Écritures dans une transaction SQL avec verrou de ligne, une ligne `token_transactions` par mouvement, cloisonnement par entreprise |
| **Transferts hors UE** | Aucun |

## Traitement 3 — Paiement des abonnements

| Rubrique | Contenu |
|---|---|
| **Finalité** | Encaisser l'abonnement mensuel des employeurs et créditer les tokens du plan |
| **Base légale** | Exécution du contrat ; obligation légale (facturation) |
| **Personnes concernées** | Employeurs |
| **Données** | Identifiant client Stripe, identifiant d'abonnement, formule, statut, prochaine échéance. **Aucune donnée de carte n'est reçue ni stockée par PRIM'O** (Stripe.js) |
| **Destinataires** | Stripe ; l'employeur concerné |
| **Durée de conservation** | Durée du contrat ; conservation comptable chez Stripe selon ses obligations légales |
| **Mesures de sécurité** | Carte saisie uniquement dans Stripe.js, signature du webhook vérifiée (`STRIPE_WEBHOOK_SECRET`), crédit des tokens dans une transaction atomique |
| **Transferts hors UE** | Possibles chez Stripe ; garanties à confirmer dans le DPA (voir tableau des sous-traitants) |

## Traitement 4 — Rachats de bons d'achat et favoris

| Rubrique | Contenu |
|---|---|
| **Finalité** | Permettre l'échange de tokens contre des codes promo partenaires, mémoriser les bons favoris |
| **Base légale** | Exécution du contrat |
| **Personnes concernées** | Employés, managers, employeurs |
| **Données** | Utilisateur, bon racheté, code promo délivré, date ; favoris (utilisateur, bon) |
| **Destinataires** | L'utilisateur ; l'employeur (commandes de son entreprise) ; l'administrateur (historique des rachats) |
| **Durée de conservation** | Rachats : conservés sans lien avec l'identité après suppression (`user_id` passe à `NULL`). Favoris : supprimés avec le compte (`ON DELETE CASCADE`) |
| **Mesures de sécurité** | Rachat dans une transaction avec verrou de ligne, bon à usage unique |
| **Transferts hors UE** | Aucun |

## Autres données liées au compte

| Donnée | Effet de la suppression du compte |
|---|---|
| Règles d'attribution planifiées | Conservées ; le bénéficiaire passe à `NULL` |
| Appartenance à une équipe (`team_members`) | Ligne conservée, utilisateur à `NULL` (point de suivi ouvert) |
| Équipe dirigée (`teams.manager_id`) | `NULL` |

## Journaux et traceurs

- Aucun cookie publicitaire ni outil de mesure d'audience.
- Le navigateur conserve la session, le panier et des préférences d'affichage (stockage local).
- Les journaux de l'API ne doivent contenir ni email, ni nom, ni jeton, ni corps de requête (règle `.claude/rules/produit.md` §4).

## Points à confirmer avant l'envoi du dossier

1. Région du service `primo-api` (Francfort attendu) et DPA acceptés dans les comptes Render, Vercel et Stripe (colonne « Statut du contrat »).
2. Décision sur les lignes `team_members` à `user_id` vide après suppression.
3. Désignation éventuelle d'un référent RGPD si le volume de données augmente.
