# Roadmap produit — Athlete Compass

Vision : un **diagnostic de performance hybride** court (âge athlétique, Hybrid Score, limiteur, Next Best Move) puis un **plan minimal** actionnable — pas une app fitness généraliste.

---

## Non-objectifs V1

- Pas de réseau social ni fil d’actualité communautaire.
- Pas de tracking d’entraînement jour après jour (volume, séries, RPE détaillé).
- Pas de module nutrition avancé (plans macros, recettes).
- Pas d’IA générative obligatoire au cœur du produit.
- Pas d’intégrations wearables (Strava, Garmin, etc.) — prévues en V6.
- Pas de promesse médicale ni biologique (voir disclaimers produit).

---

## V1 — Calculateur et diagnostic

| | |
| --- | --- |
| **Objectif produit** | Démontrer la valeur **dès la première lecture des résultats** : compréhension immédiate (âge athlétique, Hybrid Score, profil, limiteur) ; envie d’aller vers **rapport complet** / plan (visée **time-to-value** court : lecture quasi instantanée une fois sur l’écran résultats, hors temps de saisie). |
| **Features** | Profil utilisateur ; performances manuelles standardisées ; âge athlétique ; **Hybrid Score** (pondération par objectif, puis léger amortissement si fiabilité sous 55 % — `lib/scoring/hybrid-reliability-dampening.ts`) ; profil athlétique ; limiteur principal ; Next Best Move ; **fiabilité du score** ; radar ; **Performance Gap** ; objectifs 4 semaines (aperçu) ; plan minimal 4 semaines (aperçu) ; équivalences ; **Readiness + Training Debt + coach hybride (déterministe)** ; **pas du jour** (local + synchro cloud optionnelle) ; **Body Progress (démo)** ; **historique local du score** sur `/results` (snapshot au save performances + courbes Hybrid / fiabilité / âge athlétique, `localStorage`) ; premium simulé (rapport verrouillé, pricing) ; disclaimers *estimation de performance*. |
| **Écrans** | Landing ; profil ; performances ; résultats ; **Aujourd’hui** (`/daily`) ; **Body Progress** (`/body-progress`) ; tests ; équivalences ; plan ; rapport (verrouillé) ; pricing ; next-test ; blog (`/blog`). |
| **Données** | `localStorage` (profil + performances). Optionnel : compte Supabase + table `daily_steps` pour les pas ([`docs/integrations.md`](docs/integrations.md)). |
| **Complexité technique** | Faible à moyenne — Next.js App Router, scoring déterministe côté client ; routes API ciblées si Supabase + clés service configurées. |
| **Risques** | Données perdues si cache vidé ; historique score **uniquement dans le navigateur** (pas de sync multi-appareil) ; pas de revenu réel ; attentes « médical / biologique » si le wording dérive (garder les disclaimers). |
| **Critères de succès** | L’utilisateur comprend son résultat **sans aide** ; CTA vers `/report` / `/pricing` **compris** ; build stable (`typecheck`, `lint`, `test`). |
| **Métriques** | Taux de complétion profil → performances → résultats (analytics à brancher) ; temps médian sur page résultats ; clics vers `/report` et `/pricing`. |

---

## V2 — Rapport premium et paiement

| | |
| --- | --- |
| **Objectif produit** | Valider que des utilisateurs **paient** pour le rapport complet + plan détaillé. |
| **Features** | Stripe Checkout ; déblocage rapport (page privée et/ou PDF) ; offres alignées 9 / 19 / 29 € ; webhook paiement → statut `purchase` ; email de confirmation ; accès sans mot de passe lourd (magic link ou session signée). |
| **Écrans** | Checkout Stripe (hébergé) ; succès / annulation ; rapport débloqué ; historique minimal “dernier achat”. |
| **Données** | Compte léger ou identifiant post-achat ; `purchases` + `report_snapshot` ; **`premium_reports`** (JSON, PDF à venir) ; lien `assessment` ↔ `purchase` (voir `docs/FUTURE_ARCHITECTURE.md`). |
| **Complexité technique** | Moyenne — webhooks idempotents, secrets, gestion des états d’échec partiel. |
| **Risques** | Fraude / litiges CB ; RGPD email ; rapport généré différent de l’aperçu gratuit (attentes). |
| **Critères de succès** | Premier paiement réel ; taux de conversion pricing → checkout > objectif interne. |
| **Métriques** | CTR page pricing ; conversion checkout ; panier moyen ; abandon checkout ; taux d’ouverture email. |

---

## V3 — Historique et progression (~30 jours)

| | |
| --- | --- |
| **Objectif produit** | Créer de la **rétention** : revenir après un mois, retester, voir l’évolution. |
| **Features** | Compte utilisateur ; liste des bilans datés ; courbes âge athlétique / Hybrid Score (**déjà amorcé en local sur `/results`** : série + courbe navigateur) ; comparaison avant-après ; protocole de **retest 30 jours** guidé ; rappels optionnels (email). |
| **Écrans** | Dashboard “Mes bilans” ; détail d’un bilan ; lancement retest ; synthèse progression. |
| **Données** | Historique `assessments` + `performance_tests` liés ; éventuellement snapshots de profil. |
| **Architecture cible** | [`docs/FUTURE_ARCHITECTURE.md`](docs/FUTURE_ARCHITECTURE.md) — section *V3 — Bilans, historique et retest*. |
| **Complexité technique** | Moyenne — modèle de données versionné, migrations, requêtes temporelles. |
| **Risques** | Coût stockage ; complexité UX (trop de chiffres sans narration). |
| **Critères de succès** | % utilisateurs avec ≥ 2 bilans à 60 jours ; NPS ou enquête courte post-retest. |
| **Métriques** | Taux de retour à 30 jours ; nb de tests complétés par retest ; progression moyenne score ; upgrade / réachat. |

---

## V4 — Plans adaptatifs

| | |
| --- | --- |
| **Objectif produit** | Transformer le diagnostic en **accompagnement** sur plusieurs semaines, pas un PDF figé. |
| **Features** | Plan ajusté aux contraintes (fréquence, salle, jambes, etc.) ; ajustement hebdo (feedback fatigue simple) ; substitutions d’exercices ; mode “je garde mon programme” (recommandations ponctuelles) ; mode “≤ 3 jours / semaine”. |
| **Écrans** | Semaine courante du plan ; check séances ; ajustement guidé ; lien vers équivalences contextuelles. |
| **Données** | Entités `plan_instance`, logs de complétion, règles de régénération (serveur ou edge). |
| **Architecture cible** | [`docs/FUTURE_ARCHITECTURE.md`](docs/FUTURE_ARCHITECTURE.md) — section *V4 — Plans adaptatifs*. |
| **Complexité technique** | Élevée — logique métier + persistance + éviter les contradictions médicales / surentraînement (positionnement éducation, pas prescription). |
| **Risques** | Attente “coach IA” vs réalité ; charge support si promesses trop fortes. |
| **Critères de succès** | Taux d’activation plan ; séances cochées / semaine ; satisfaction enquête ; évolution score à 8 semaines. |
| **Métriques** | Activation plan ; complétion séances ; churn plan ; delta Hybrid Score. |

---

## V5 — Version coach / salle (B2B / B2B2C)

| | |
| --- | --- |
| **Objectif produit** | Permettre à un **coach** ou une **petite salle** de générer et suivre des bilans clients. |
| **Features** | Espace coach ; création client ; lancement bilan ; suivi multi-clients ; export PDF brandé (logo salle) ; bibliothèque de tests ; notes privées coach ; permissions (coach vs client). |
| **Écrans** | Liste clients ; fiche client ; bilan partagé ; paramètres marque blanche limités. |
| **Données** | `organization` / `coach` / `client` ; partage lecture ; audit log basique. |
| **Complexité technique** | Élevée — RBAC, facturation B2B, isolation des données. |
| **Risques** | RGPD données santé-adjacentes ; support multi-tenant ; pricing trop bas vs coût. |
| **Critères de succès** | Pilotes avec ≥ N salles ou coachs ; PDF utilisé en rendez-vous réel. |
| **Métriques** | MRR B2B ; nb de bilans générés par org ; rétention org 6 mois. |
| **Pricing possible (indicatif)** | Coach solo ~29 €/mois ; petite salle 79–149 €/mois ; variante au rapport généré. |

---

## V6 — Intégrations (données externes)

| | |
| --- | --- |
| **Objectif produit** | Réduire la **saisie manuelle** et enrichir le contexte (volume, allure, erg). |
| **Intégrations possibles** | Strava ; Garmin ; Apple Health ; Google Fit ; Concept2 Logbook ; wearables type Whoop / **Oura** (plus tard). |
| **Écrans** | Connexion compte tiers ; mapping champs ; consentements ; réconciliation avec tests “officiels” du produit. |
| **Données** | Tokens OAuth ; activités brutes ; tables de correspondance test ↔ activité. |
| **Complexité technique** | Très élevée — APIs hétérogènes, quotas, normalisation, sync incrémentale. |
| **Risques** | Maintenance continue ; privacy ; utilisateurs qui croient que “l’app lit tout” sans effort qualité. |
| **Critères de succès** | % utilisateurs avec ≥ 1 source connectée ; baisse du temps de saisie bilan. |
| **Métriques** | Taux de connexion intégration ; erreurs sync ; désactivations. |

---

## Hybrid Score — chantiers score & produit

**Déjà en place**

- Cinq piliers agrégés puis **Hybrid** = moyenne pondérée par objectif (`goal-weights.ts`, `hybrid-score.ts`).
- **Fiabilité %** calculée à part (`reliability.ts`) — reste l’indicateur principal du niveau de complétude.
- **Modulation** : si la fiabilité est strictement inférieure à **55 %**, le Hybrid affiché est légèrement rapproché de **50** (neutre) pour éviter un chiffre trop confiant avec peu de tests (`hybrid-reliability-dampening.ts`).
- **Historique local** : à chaque sauvegarde performances, snapshot Hybrid + fiabilité + âge réel + objectif + **âge athlétique** (`score-snapshots.ts`, clé `ac_score_snapshots_v1`) ; courbes **Hybrid + fiabilité** et **âge athlétique** sur `/results` (`score-snapshots-local.tsx`).

**Suite prioritaire (score)**

1. **Calibration** — revue des barèmes par épreuve (sexes, poids, cohortes terrain) ; changelog versionné des changements.
2. **Transparence UX** — sur `/results` et fiche bilan, texte d’aide sous le Hybrid quand fiabilité strictement inférieure à 55 % (amortissement) ; affiner le wording si besoin.
3. **V3** — porter en cloud ce qui existe déjà en local (Hybrid + fiabilité dans le temps sur `/results`, `lib/scoring/score-snapshots.ts`) ; historiser **aussi** les piliers à chaque bilan pour courbes et comparatif temporel complet.
4. **A/B ou télémétrie** — mesurer l’effet des ajustements de pondération (quand analytics branché).

**Note de vocabulaire** : dans ce fichier, le palier produit **« V2 »** désigne surtout **Stripe / rapport premium**. La couche **auth + pas cloud** est décrite dans [`docs/integrations.md`](docs/integrations.md) pour éviter la confusion avec le palier paiement.

---

## Liens utiles

- **À faire (config)** : [`docs/V2_A_FAIRE.md`](docs/V2_A_FAIRE.md) — Stripe, Resend, déploiement.
- Pas cloud & readiness : [`docs/integrations.md`](docs/integrations.md)
- Amortissement Hybrid / fiabilité : `lib/scoring/hybrid-reliability-dampening.ts`
- Architecture cible V2+ : [`docs/FUTURE_ARCHITECTURE.md`](docs/FUTURE_ARCHITECTURE.md)
- Types cloud préparatoires : `lib/future/cloud-types.ts`
- Prompts d’exécution historiques : dossier `doc/`
