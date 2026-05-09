# Intégrations santé & wearables (futur)

Cette page décrit les **intégrations prévues** (pas implémentées en V1). L’argument produit reste : *« Pas besoin de montre connectée pour commencer. »*

## Principes

- **V1 / V1.5** : saisie manuelle + démo (`lib/mock/daily.ts`, etc.). Après **Profil → Performances**, l’app envoie vers **`/daily`** comme hub quotidien (voir aussi prompts agrégés §13 `athlete_compass_prompts_ordre_complet.md`).
- **V6 (voir [`ROADMAP.md`](../ROADMAP.md))** : synchronisation optionnelle pour enrichir readiness, sommeil et charge — jamais obligatoire au diagnostic initial.

## Périmètre par fournisseur (indicatif)

| Source | Données utiles | Complexité | Valeur utilisateur | Priorité cible | Risques |
| --- | --- | --- | --- | --- | --- |
| **Apple Health** | Sommeil, pas, FC repos, entraînements | Élevée (HealthKit, consentements) | Forte sur iOS | Haute | Review App Store, privacy |
| **Google Fit** | Pas, activité, sommeil partiel | Moyenne | Android large | Haute | Fragmentation API |
| **Garmin** | FC, HRV, charge, course/vélo | Élevée | Très forte endurance | Haute | OAuth, modèles variés |
| **Strava** | Sorties course/vélo, charge | Moyenne | Communauté | Moyenne | Données incomplètes vs salle |
| **Concept2 Logbook** | Rameur / SkiErg | Moyenne | Alignement tests produit | Moyenne | Comptes segmentés |
| **Fitbit** | Sommeil, pas | Moyenne | Grand public | Basse | Concurrence Garmin/Apple |
| **Whoop** | Récupération, sommeil | Moyenne | Power users | Basse | Audience niche, coût API |
| **Oura** | Sommeil, readiness, température | Moyenne | Bague, utilisateurs « recovery » | Basse | API / modèle commercial, overlap Whoop/Garmin |

Les connecteurs ci-dessus sont visés **V6** dans [`ROADMAP.md`](../ROADMAP.md) (version coach / salle en **V5**). Le fichier agrégé **`athlete_compass_prompts_ordre_complet.md`** (§14) les liste pour le cadrage produit.

## Données transverses utiles

- Pas quotidiens, sommeil (durée + qualité si dispo).
- FC au repos, **HRV** si disponible (readiness avancé).
- Séances externes (durée, type, charge perçue).
- **Rameur** : temps / watts pour recaler les tests sans ressaisie manuelle.

## Prochaine étape technique (quand le produit tranchera)

1. Choisir un **premier connecteur** (souvent Strava ou Garmin pour l’hybride).
2. Définir le **modèle de données** (tables `wearable_connections`, `daily_metrics`).
3. Relire **RGPD** : finalité, durée de conservation, export/suppression.

Pour l’architecture cible côté cloud, voir aussi [`docs/FUTURE_ARCHITECTURE.md`](FUTURE_ARCHITECTURE.md) et [`ROADMAP.md`](../ROADMAP.md).
