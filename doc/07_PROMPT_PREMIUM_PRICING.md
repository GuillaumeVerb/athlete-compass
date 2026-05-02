# Prompt 07 — Premium, pricing et monétisation simulée

Ajoute une couche premium simulée à **Athlete Compass**.

## Objectif

Préparer la monétisation sans intégrer Stripe pour l’instant.

Le but est de tester la valeur perçue avant de construire une vraie infrastructure de paiement.

## Modèle gratuit

Le gratuit doit donner :

- âge athlétique estimé ;
- Hybrid Score ;
- profil athlétique ;
- fiabilité du score ;
- prochain test recommandé ;
- Next Best Move résumé.

## Modèle premium

Le premium doit débloquer :

- âge par système ;
- Performance Gap détaillé ;
- limiteur principal expliqué ;
- objectifs 4 semaines ;
- plan minimal efficace ;
- équivalences machines ;
- protocole de retest à 30 jours ;
- export rapport PDF plus tard.

## Offres à afficher

### Bilan complet — 9 €

Inclut :

- rapport détaillé ;
- âge athlétique ;
- Hybrid Score ;
- profil athlète ;
- prochain test recommandé ;
- limiteur principal résumé.

### Plan 4 semaines — 19 €

Inclut :

- objectifs 4 semaines ;
- plan minimal efficace ;
- séances détaillées ;
- cohérence hebdomadaire ;
- protocole de retest.

### Pack complet — 29 €

Inclut :

- tout le bilan complet ;
- tout le plan 4 semaines ;
- équivalences machines ;
- retest 30 jours ;
- meilleure valeur perçue.

Le Pack complet doit être mis en avant avec :

- badge “Le meilleur choix” ;
- bordure ambre ;
- bouton ambre ;
- hiérarchie visuelle plus forte.

## À implémenter

- page pricing simple ;
- cartes premium verrouillées visuellement ;
- CTA “Débloquer mon rapport complet” ;
- CTA “Voir les offres” ;
- mock checkout disabled ;
- texte “Paiement bientôt disponible” ou “Simulation V1” si nécessaire ;
- pas de vraie intégration Stripe pour l’instant.

## Sections premium verrouillées

Dans le rapport complet, afficher les modules verrouillés :

- Âge par système ;
- Performance Gap ;
- Limiteur principal ;
- Objectifs 4 semaines ;
- Plan minimal efficace ;
- Équivalences machines.

Chaque carte doit contenir :

- icône cadenas ;
- titre ;
- phrase courte de valeur ;
- aperçu léger, mais pas tout le contenu.

## Copywriting

Ne pas vendre un “score”. Vendre un diagnostic + plan.

Exemples de textes :

> Débloque ton rapport complet pour comprendre ce qui limite ton physique hybride.

> Obtiens tes objectifs personnalisés et ton plan minimal pour les 4 prochaines semaines.

> Tu ne paies pas pour un chiffre. Tu paies pour savoir quoi faire ensuite.

## Contraintes

- Ne pas intégrer Stripe maintenant.
- Ne pas forcer l’utilisateur à créer un compte.
- Ne pas promettre de résultat médical ou biologique.
- Ne pas écrire “rajeunis ton corps” sans préciser que c’est une estimation de performance.

