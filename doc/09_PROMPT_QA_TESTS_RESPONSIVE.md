# Prompt 09 — QA, tests, états vides et responsive

Fais une passe qualité complète sur **Athlete Compass**.

## Objectif

Stabiliser la V1 pour qu’elle soit démontrable, lisible, responsive et sans erreurs évidentes.

## À vérifier

### TypeScript

- Lancer `npm run typecheck` si disponible.
- Corriger toutes les erreurs TypeScript.
- Éviter les `any` inutiles.
- Créer des types propres pour profil, performances, scores, plan.

### Lint

- Lancer `npm run lint` si disponible.
- Corriger les erreurs simples.

### Formulaires

Vérifier :

- champs requis ;
- champs optionnels ;
- unités ;
- formats temps `mm:ss` ;
- nombres invalides ;
- valeurs vides ;
- navigation entre pages ;
- stockage local si déjà implémenté.

### États vides

Si l’utilisateur n’a presque rien rempli, afficher :

> Ton score est encore provisoire. Ajoute au moins 3 tests pour obtenir une première lecture utile.

Si aucun test n’est rempli, ne pas afficher un score absurde.

### Score reliability

Afficher clairement :

- faible ;
- moyen ;
- bon ;
- élevé.

Et expliquer pourquoi.

### Responsive mobile

Vérifier :

- landing page ;
- formulaire profil ;
- formulaire performances ;
- dashboard résultat ;
- page rapport ;
- page plan ;
- page pricing.

Sur mobile :

- pas de débordement horizontal ;
- textes lisibles ;
- cartes empilées ;
- navigation accessible ;
- CTA visibles.

### Accessibilité minimum

- labels sur les inputs ;
- contraste suffisant ;
- boutons focusables ;
- structure de titres cohérente.

### Graphiques

Vérifier que Recharts ne casse pas en mobile.

Si nécessaire :

- réduire les labels ;
- fixer une hauteur minimum ;
- prévoir un fallback si données insuffisantes.

## Tests unitaires facultatifs

Si le projet a Vitest ou Jest, ajouter des tests pour :

- parsing des temps ;
- scoring rameur ;
- scoring force relative ;
- calcul Hybrid Score ;
- calcul reliability ;
- profil principal ;
- Next Best Move.

Sinon, ajouter un fichier `lib/scoring/examples.ts` avec cas de test manuels.

## Livrable attendu

- app stable ;
- pas d’erreurs TypeScript ;
- UX mobile correcte ;
- états vides propres ;
- README mis à jour avec commandes de vérification.

