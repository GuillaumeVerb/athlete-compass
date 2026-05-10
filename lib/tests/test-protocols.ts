import type { PerformanceInput } from "@/lib/types";

/** Clés de tests affichés dans l’app (hors `loadNotes`, métadonnée). */
export type PerformanceTestKey = Exclude<keyof PerformanceInput, "loadNotes">;

/** Contenu aligné sur le prompt 04 — protocoles standardisés V1 */
export interface TestProtocol {
  id: PerformanceTestKey;
  title: string;
  estimatedMinutes: string;
  category: string;
  equipment: string;
  measures: string;
  protocol: string[];
  inputHint: string;
  commonMistakes: string[];
  scoreImpact: string;
}

export const TEST_PROTOCOLS: Record<PerformanceTestKey, TestProtocol> = {
  row1k: {
    id: "row1k",
    title: "1 km rameur",
    estimatedMinutes: "25–35 min (avec échauffement)",
    category: "Cardio intense",
    equipment: "Rameur Concept2 ou équivalent",
    measures: "Moteur court / cardio intense.",
    protocol: [
      "Échauffement : 8 à 10 min faciles + 2 accélérations de ~20 s.",
      "Damper modéré, idéalement entre 4 et 6.",
      "Réaliser 1000 m le plus vite possible avec une technique propre.",
    ],
    inputHint: "Saisir le temps total au format mm:ss (ex. 03:32).",
    commonMistakes: [
      "Partir trop vite dès le départ.",
      "Tirer surtout avec les bras.",
      "Arrondir le dos en fin d’effort.",
    ],
    scoreImpact: "Pilier « Cardio intense » du radar et poids fort dans le Hybrid Score.",
  },
  skiErg500: {
    id: "skiErg500",
    title: "500 m SkiErg",
    estimatedMinutes: "20–30 min",
    category: "Cardio intense",
    equipment: "SkiErg Concept2 ou équivalent",
    measures: "Puissance cardio « tirage » complémentaire du rameur.",
    protocol: [
      "Échauffement léger puis 2 séries courtes de montée en régime.",
      "Damper modéré ; enchaînement bras–jambe régulier sur 500 m.",
    ],
    inputHint: "Temps total mm:ss pour 500 m.",
    commonMistakes: [
      "Uniquement tirer avec les bras.",
      "Séparer trop les phases jambe / bras.",
    ],
    scoreImpact: "Pilier « Cardio intense » — moyenné avec le 1 km rameur si les deux sont renseignés.",
  },
  run400m: {
    id: "run400m",
    title: "400 m piste",
    estimatedMinutes: "35–50 min",
    category: "Cardio intense / vitesse",
    equipment: "Piste 400 m ou terrain mesuré",
    measures: "Vitesse soutenue courte, complément du 5 km.",
    protocol: [
      "Échauffement progressif : footings, gammes, 2 accélérations courtes.",
      "400 m à intensité maximale tenable (départ sans sprint désordonné).",
    ],
    inputHint: "Temps total mm:ss pour 400 m.",
    commonMistakes: [
      "Courbe non tangée (distance > 400 m).",
      "Vent fort ou dénivelé sans le noter.",
    ],
    scoreImpact: "Pilier « Cardio intense » — moyenné avec rameur / SkiErg 500 si renseignés.",
  },
  row2k: {
    id: "row2k",
    title: "2 km rameur",
    estimatedMinutes: "30–40 min",
    category: "Endurance / moteur",
    equipment: "Rameur Concept2 ou équivalent",
    measures: "Capacité à maintenir une intensité plus longue qu’au 1 km.",
    protocol: [
      "Échauffement léger puis montée en régime progressive.",
      "Pacing régulier : éviter le sprint sur les 500 premiers mètres.",
      "Viser une allure stable sur la 2e moitié.",
    ],
    inputHint: "Temps total mm:ss pour 2000 m.",
    commonMistakes: [
      "Exploser le début puis s’effondrer.",
      "Damper trop haut pour tenir la distance.",
    ],
    scoreImpact: "Pilier « Endurance » et distinction moteur court vs hybride.",
  },
  run5k: {
    id: "run5k",
    title: "5 km course",
    estimatedMinutes: "40–55 min",
    category: "Endurance",
    equipment: "Piste, route plate ou tapis",
    measures: "Endurance « terrain » utile en hybride / HYROX.",
    protocol: [
      "Parcours plutôt plat, allure régulière.",
      "Éviter de passer ce test le lendemain d’une grosse séance jambes.",
    ],
    inputHint: "Temps total mm:ss pour 5 km.",
    commonMistakes: [
      "Départ trop rapide sur les 2 premiers km.",
      "Parcours très vallonné sans le noter (biaise la comparaison).",
    ],
    scoreImpact: "Pilier « Endurance » et cohérence avec les données rameur.",
  },
  run10k: {
    id: "run10k",
    title: "10 km course",
    estimatedMinutes: "55–75 min",
    category: "Endurance",
    equipment: "Piste, route plate ou tapis",
    measures: "Endurance longue ; complète le 5 km.",
    protocol: [
      "Parcours plat ou tapis ; hydratation si besoin.",
      "Allure régulière : viser un rythme stable plutôt qu’un départ trop rapide.",
    ],
    inputHint: "Temps total mm:ss pour 10 km.",
    commonMistakes: [
      "Comparer une séance trail vallonnée à un 10 km plat.",
      "Passer le test en pleine semaine de compétition.",
    ],
    scoreImpact: "Pilier « Endurance » — moyenné avec 5 km, 2 km rameur, BikeErg, etc.",
  },
  run1kIncline: {
    id: "run1kIncline",
    title: "1 km tapis incliné (2 %)",
    estimatedMinutes: "25–35 min",
    category: "Endurance",
    equipment: "Tapis avec inclinaison réglable",
    measures: "Endurance course quand le plat extérieur n’est pas disponible.",
    protocol: [
      "Inclinaison fixe 2 % pour toute la distance.",
      "1000 m chronométrés, allure maximale tenable.",
    ],
    inputHint: "Temps total mm:ss pour 1000 m à 2 %.",
    commonMistakes: [
      "Changer l’inclinaison en cours d’épreuve.",
      "Tenir les mains aux barres de façon irrégulière (biaise le temps).",
    ],
    scoreImpact: "Pilier « Endurance » — moyenné avec les autres tests longs.",
  },
  bikeErg1k: {
    id: "bikeErg1k",
    title: "1 km BikeErg",
    estimatedMinutes: "25–35 min",
    category: "Endurance / moteur",
    equipment: "BikeErg Concept2 ou équivalent",
    measures: "Endurance cyclée utile en hybride / HYROX (station vélo).",
    protocol: [
      "Réglage selle habituel ; échauffement progressif.",
      "1000 m à allure maximale tenable (pas d’explosion sur les 200 premiers m).",
    ],
    inputHint: "Temps total mm:ss pour 1000 m.",
    commonMistakes: [
      "Cadence trop basse avec gros braquet dès le départ.",
      "Comparer avec un vélo outdoor non calibré.",
    ],
    scoreImpact: "Pilier « Endurance » — moyenné avec 2 km rameur et 5 km course si renseignés.",
  },
  bikeErg2k: {
    id: "bikeErg2k",
    title: "2 km BikeErg",
    estimatedMinutes: "35–45 min",
    category: "Endurance / moteur",
    equipment: "BikeErg Concept2 ou équivalent",
    measures: "Endurance cyclée longue.",
    protocol: [
      "Même réglage selle qu’à l’habitude ; échauffement fluide.",
      "2000 m à allure maximale tenable, pacing régulier.",
    ],
    inputHint: "Temps total mm:ss pour 2000 m.",
    commonMistakes: [
      "Démarrer trop vite sur les 500 premiers mètres.",
      "Comparer avec vélo route (non équivalent).",
    ],
    scoreImpact: "Pilier « Endurance » — moyenné avec 1 km BikeErg et course.",
  },
  skiErg2k: {
    id: "skiErg2k",
    title: "2 km SkiErg",
    estimatedMinutes: "35–50 min",
    category: "Endurance / tirage",
    equipment: "SkiErg Concept2 ou équivalent",
    measures: "Endurance en tirage ; croise utilement avec le 2 km rameur.",
    protocol: [
      "Damper modéré ; échauffement + 2 séries courtes de montée en régime.",
      "2000 m enchaînés, technique bras–jambes stable.",
    ],
    inputHint: "Temps total mm:ss pour 2000 m.",
    commonMistakes: [
      "Surutiliser uniquement les bras en fin d’épreuve.",
      "Découper l’effort par longues pauses sur les appuis.",
    ],
    scoreImpact: "Pilier « Endurance » — moyenné avec rameur et course.",
  },
  wallBall150: {
    id: "wallBall150",
    title: "Wall ball ×150",
    estimatedMinutes: "25–40 min",
    category: "Hybride / résistance musculaire",
    equipment: "Mur ; medicine ball 9 kg (homme) ou 6 kg (femme) selon standard salle",
    measures: "Volume épaules + jambes + cardio intégré.",
    protocol: [
      "Cible à hauteur standard (≈ 3 m homme / 2,7 m femme en compétition type).",
      "150 répétitions d’affilée ; squat puis lancer au mur, réception en squat.",
    ],
    inputHint:
      "Temps total mm:ss pour les 150 reps. Tu peux noter la masse du ballon (kg) dans le champ optionnel sous le chrono.",
    commonMistakes: [
      "Ballon plus lourd que le standard sans le noter.",
      "Squat partiel pour aller plus vite.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — moyenné avec burpees, chipper, etc.",
  },
  pullups: {
    id: "pullups",
    title: "Tractions strictes",
    estimatedMinutes: "15–25 min",
    category: "Force relative / haut du corps",
    equipment: "Barre de traction",
    measures: "Force relative et résistance en tirage.",
    protocol: [
      "Départ bras tendus, menton au-dessus de la barre.",
      "Pas de kipping, pas d’élan excessif.",
      "Arrêter quand l’amplitude ou la vitesse se dégrade nettement.",
    ],
    inputHint: "Nombre de répétitions strictes complètes.",
    commonMistakes: [
      "Demi-amplitude pour gonfler le compteur.",
      "Kipping ou balancement des jambes.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » et cohérence force haut du corps.",
  },
  dipsStrict: {
    id: "dipsStrict",
    title: "Dips parallèles stricts (set max)",
    estimatedMinutes: "15–25 min",
    category: "Force relative / poussée verticale",
    equipment: "Barres parallèles ou station dips",
    measures: "Endurance de poussée en extension de coude + épaules.",
    protocol: [
      "Départ bras tendus, descente contrôlée à 90° d’épaule ou amplitude complète selon confort.",
      "Extension complète en haut sans lockout agressif des coudes.",
      "Set max strict : pas d’élan des jambes, pas de demi-amplitude.",
    ],
    inputHint: "Nombre max de reps strictes sur un set.",
    commonMistakes: [
      "Coudes en flair excessif ou trop serrés de façon incohérente entre les tests.",
      "Utiliser la largeur de barres la plus favorable sans la fixer pour les retests.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — moyenné avec tractions et pompes.",
  },
  toesToBar: {
    id: "toesToBar",
    title: "Toes-to-bar stricts",
    estimatedMinutes: "15–25 min",
    category: "Résistance musculaire / gainage dynamique",
    equipment: "Barre de traction",
    measures: "Contrôle du hollow + tirage jambes vers la barre sans kipping.",
    protocol: [
      "Départ bras tendus, pieds devant ; pieds toucher la barre en strict.",
      "Pas de balancement excessif ni de kipping.",
    ],
    inputHint: "Nombre max de reps strictes sur un set (sans lâcher la barre).",
    commonMistakes: [
      "Fermer trop tôt les hanches (style knees-to-elbow seulement).",
      "Kipping pour gonfler le compteur.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — moyenné avec tractions et burpees si renseignés.",
  },
  airSquat100: {
    id: "airSquat100",
    title: "100 air squats",
    estimatedMinutes: "15–25 min",
    category: "Résistance musculaire jambes",
    equipment: "Espace au sol",
    measures: "Endurance de squat au poids du corps.",
    protocol: [
      "Squat complet : hanche sous ligne du genou, extension en haut.",
      "100 répétitions d’affilée, chronomètre lancé au premier squat.",
    ],
    inputHint: "Temps total mm:ss pour les 100 reps.",
    commonMistakes: [
      "Amplitude réduite pour gagner du temps.",
      "Pauses longues avec mains sur les cuisses.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — moyenné avec wall ball et fentes.",
  },
  hybridDbChipper: {
    id: "hybridDbChipper",
    title: "Chipper : thrusters DB + burpees + DU",
    estimatedMinutes: "25–40 min",
    category: "Hybride",
    equipment: "Paire d’haltères 22,5 kg (homme) ou 15 kg (femme) ; corde à sauter",
    measures: "Enchaînement thruster / burpee / corde — format type compét / WOD.",
    protocol: [
      "For time : 30 DB thrusters (2 haltères, standard squat to overhead).",
      "Puis 30 burpees (poitrine au sol, saut ou extension en haut).",
      "Puis 150 double-unders ; chronomètre arrêté à la dernière corde valide.",
    ],
    inputHint:
      "Temps total mm:ss du chipper complet. Charge thruster : indique la somme des deux haltères (kg) dans le champ optionnel si tu t’écartes du standard.",
    commonMistakes: [
      "Charges différentes du standard sans les noter.",
      "Compter des simple-unders ou des demi-burpees.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — complète burpees et DU seuls.",
  },
  doubleUnders1min: {
    id: "doubleUnders1min",
    title: "Double-unders (1 min)",
    estimatedMinutes: "10–15 min",
    category: "Coordination / cardio léger",
    equipment: "Corde à sauter",
    measures: "Rythme et endurance de mollets / coordination.",
    protocol: [
      "1 minute chrono : compter uniquement les doubles valides.",
      "Repartir à zéro après un trip ; noter le total final.",
    ],
    inputHint: "Nombre de double-unders réalisés en 1 minute.",
    commonMistakes: [
      "Compter des rotations incomplètes.",
      "Corde trop longue ou trop courte sans réglage habituel.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — moyenné avec chipper et burpees.",
  },
  pushupsStrict: {
    id: "pushupsStrict",
    title: "Pompes strictes (set max)",
    estimatedMinutes: "10–20 min",
    category: "Force relative / poussée",
    equipment: "Sol",
    measures: "Endurance de poussée horizontale.",
    protocol: [
      "Corps gainé, mains sous les épaules, poitrine près du sol chaque rep.",
      "Pas de serpentage ; set max sans relâcher la position planche.",
    ],
    inputHint: "Nombre max de reps strictes sur un set.",
    commonMistakes: [
      "Amplitude incomplète.",
      "Hanches trop hautes ou basses.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — équilibre avec les tirages.",
  },
  ropeClimb2min: {
    id: "ropeClimb2min",
    title: "Montées de corde strictes (2 min)",
    estimatedMinutes: "20–35 min",
    category: "Tirage vertical",
    equipment: "Corde fixe, hauteur standard",
    measures: "Force tirage + technique de grimper.",
    protocol: [
      "Montées strictes (pas de style butterfly excessif).",
      "Descente contrôlée ; 2 minutes chrono, noter le nombre de montées complètes.",
    ],
    inputHint: "Nombre de montées complètes en 2 minutes.",
    commonMistakes: [
      "Ne pas toucher la cible haute définie.",
      "Descendre en chute libre.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — complète tractions et T2B.",
  },
  lunges2min: {
    id: "lunges2min",
    title: "Fentes alternées sans charge (2 min)",
    estimatedMinutes: "15–25 min",
    category: "Résistance jambes",
    equipment: "Espace linéaire",
    measures: "Volume fentes au poids du corps sur durée fixe.",
    protocol: [
      "2 minutes chrono ; fente avant alternée, genou arrière proche du sol.",
      "Compter chaque pas avant comme une rep (1 pas = 1 fente).",
    ],
    inputHint: "Nombre total de pas (reps) en 2 minutes.",
    commonMistakes: [
      "Torse penché trop en avant.",
      "Genou avant qui rentre (valgus excessif).",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — volume jambes et posture.",
  },
  frontSquat5: {
    id: "frontSquat5",
    title: "Front squat ×5",
    estimatedMinutes: "25–40 min",
    category: "Force jambes + tronc",
    equipment: "Barre, rack, poids",
    measures: "Charge maximale pour 5 répétitions propres (pas de 1RM en V1).",
    protocol: [
      "Amplitude maîtrisée, buste stable, rack solide sur les épaules.",
      "Montée en charge par paliers jusqu’à 5 reps difficiles mais propres.",
    ],
    inputHint: "Charge en kg pour un set de 5 reps propres.",
    commonMistakes: [
      "S’effondrer en bas de squat.",
      "Coude qui chute / barre qui roule.",
    ],
    scoreImpact: "Pilier « Force » (ratio charge / poids de corps).",
  },
  backSquat3: {
    id: "backSquat3",
    title: "Back squat ×3",
    estimatedMinutes: "25–40 min",
    category: "Force jambes",
    equipment: "Barre, rack, poids",
    measures: "Force jambes en squat dorsal ; complète le front squat ×5.",
    protocol: [
      "Parallèle ou en dessous selon mobilité, mais cohérent entre les tests.",
      "3 répétitions lourdes mais propres, pas d’échec technique.",
    ],
    inputHint: "Charge en kg pour 3 reps propres.",
    commonMistakes: [
      "Profondeur incohérente vs ton front squat.",
      "Good morning squat : barre qui monte en flexion du buste.",
    ],
    scoreImpact: "Pilier « Force » — moyenné avec front squat, OHP et deadlift.",
  },
  ohp5: {
    id: "ohp5",
    title: "Développé militaire strict ×5 (barre)",
    estimatedMinutes: "20–35 min",
    category: "Force épaules",
    equipment: "Barre olympique, rack ou cage",
    measures: "Force épaules debout en strict press (développé militaire).",
    protocol: [
      "Strict press debout, pas de poussée des jambes (pas de push press).",
      "Gainage serré, amplitude complète.",
    ],
    inputHint: "Charge en kg pour 5 reps strictes debout à la barre.",
    commonMistakes: [
      "Arche lombaire excessive.",
      "Pousser avec les jambes ou les hanches.",
    ],
    scoreImpact: "Pilier « Force » (haut du corps, ratio au poids de corps).",
  },
  deadlift5: {
    id: "deadlift5",
    title: "Deadlift ×5",
    estimatedMinutes: "25–40 min",
    category: "Chaîne postérieure",
    equipment: "Barre ou trap bar (noter si trap bar)",
    measures: "Force de chaîne postérieure en répétitions.",
    protocol: [
      "5 reps propres, dos neutre, pas d’échec technique.",
      "Trap bar acceptée si c’est ton référentiel habituel.",
    ],
    inputHint: "Charge en kg pour 5 reps propres.",
    commonMistakes: [
      "Dos rond sous charge.",
      "Hanches trop hautes / barre éloignée du corps.",
    ],
    scoreImpact: "Pilier « Force » (souvent le lift le plus « lourd » du triplet).",
  },
  tbarRow10: {
    id: "tbarRow10",
    title: "Rowing T-bar (machine) ×10",
    estimatedMinutes: "20–35 min",
    category: "Force tirage / dos",
    equipment: "Machine T-bar ou station équivalente (même appareil entre les tests)",
    measures: "Force de tirage horizontal en volume modéré.",
    protocol: [
      "Buste stable, tirage contrôlé ; 10 reps propres d’affilée.",
      "Noter la charge totale affichée (ou plaques) pour 10 reps sans échec.",
    ],
    inputHint: "Charge en kg pour un set de 10 reps strictes.",
    commonMistakes: [
      "Rompre l’amplitude pour passer plus lourd.",
      "Changer de machine ou de réglage de poignée entre deux mesures.",
    ],
    scoreImpact: "Pilier « Force » — moyenné avec squat, OHP et deadlift.",
  },
  burpees50: {
    id: "burpees50",
    title: "50 burpees",
    estimatedMinutes: "15–25 min",
    category: "Résistance musculaire + cardio",
    equipment: "Espace au sol",
    measures: "Capacité à enchaîner volume + cardio intégré.",
    protocol: [
      "Poitrine au sol, extension complète en haut.",
      "Petit saut ou extension debout : rester cohérent du début à la fin.",
    ],
    inputHint: "Temps total mm:ss pour enchaîner 50 burpees.",
    commonMistakes: [
      "Poitrine qui ne touche plus le sol en fin de série.",
      "S’arrêter trop longtemps (garder un rythme fluide).",
    ],
    scoreImpact: "Pilier « Résistance musculaire » + partie cardio courte.",
  },
  farmerCarry: {
    id: "farmerCarry",
    title: "Farmer carry",
    estimatedMinutes: "15–25 min",
    category: "Core & carry",
    equipment: "Haltères, kettlebells ou trap bar chargée",
    measures: "Grip, trapèzes, core, capacité à porter sous fatigue.",
    protocol: [
      "Charge par main, distance et temps mesurés.",
      "Posture stable, pas de straps pour coller au standard.",
    ],
    inputHint:
      "Format conseillé : mètres / secondes séparés par un slash, ex. 40/35 (= 40 m en 35 s). Tu peux ajouter la charge totale portée (kg) dans le champ optionnel.",
    commonMistakes: [
      "Dos voûté ou pas rythme de marche instable.",
      "Straps qui masquent la limite de grip (hors protocole strict).",
    ],
    scoreImpact: "Pilier « Core & carry ».",
  },
  sandbagCarry: {
    id: "sandbagCarry",
    title: "Sandbag carry",
    estimatedMinutes: "20–35 min",
    category: "Core & carry",
    equipment: "Sandbag ou sac lesté",
    measures: "Portage type course hybride / station.",
    protocol: [
      "Même format que farmer : distance et temps mesurés (ex. 40 m en 50 s).",
      "Port en bear hug ou épaule, mais rester cohérent entre les tests.",
    ],
    inputHint:
      "Mètres / secondes au format 40/50 (slash). Poids du sac (kg) possible dans le champ optionnel.",
    commonMistakes: [
      "Poids du sac non stable entre deux tests.",
      "Poser le sac trop souvent (fausse la vitesse).",
    ],
    scoreImpact: "Pilier « Core & carry » — moyenné avec farmer et sled.",
  },
  sledCarry: {
    id: "sledCarry",
    title: "Sled 50 m (push ou pull)",
    estimatedMinutes: "20–35 min",
    category: "Core & carry / hybride",
    equipment: "Traîneau + charges",
    measures: "Puissance et tenue sous charge en translation.",
    protocol: [
      "Distance fixe 50 m (noter push ou pull dans ton carnet).",
      "Chronométrer du départ arrêté à la ligne d’arrivée.",
    ],
    inputHint:
      "Format 50/temps en secondes, ex. 50/55 (= 50 m en 55 s). Charge sur le sled (kg) en option.",
    commonMistakes: [
      "Distance différente de 50 m.",
      "Surface très glissante vs bitume (biaise les temps).",
    ],
    scoreImpact: "Pilier « Core & carry » — moyenné avec farmer et sandbag.",
  },
  hollowHold: {
    id: "hollowHold",
    title: "Hollow hold",
    estimatedMinutes: "10–15 min",
    category: "Gainage profond",
    equipment: "Tapis",
    measures: "Gainage profond / contrôle du tronc.",
    protocol: [
      "Bas du dos collé au sol, jambes tendues si possible.",
      "Bras au-dessus de la tête, arrêt si le bas du dos se décolle.",
    ],
    inputHint: "Temps maximal tenu au format mm:ss.",
    commonMistakes: [
      "Compenser en fléchissant trop les genoux.",
      "Tenir avec le dos qui se décole (fausse la mesure).",
    ],
    scoreImpact: "Pilier « Core & carry ».",
  },
  lSitHold: {
    id: "lSitHold",
    title: "L-sit (parallèles)",
    estimatedMinutes: "10–20 min",
    category: "Gainage / compression",
    equipment: "Parallèles stables",
    measures: "Compression hanche + gainage de tronc.",
    protocol: [
      "Bras tendus, jambes tendues devant, angle 90° si possible.",
      "Chronomètre le temps cumulé maximal tenu (ou un seul bloc max).",
    ],
    inputHint: "Temps maximal tenu au format mm:ss.",
    commonMistakes: [
      "Plier trop les coudes pour gagner de la hauteur.",
      "Genoux fléchis déguisés en L-sit.",
    ],
    scoreImpact: "Pilier « Core & carry » — moyenné avec hollow hold.",
  },
  benchPress5: {
    id: "benchPress5",
    title: "Développé couché ×5 (barre)",
    estimatedMinutes: "25–40 min",
    category: "Force poussée horizontale",
    equipment: "Barre, rack, banc plat",
    measures: "Force de poussée horizontale (distincte dips / OHP).",
    protocol: [
      "Pieds au sol, arc léger naturel, amplitude complète.",
      "5 reps propres sans spotter agressif ni arch extrême compétition-only.",
    ],
    inputHint: "Charge en kg pour 5 reps propres.",
    commonMistakes: [
      "Fessier trop haut décollé du banc.",
      "Demi-amplitude pour gonfler la charge.",
    ],
    scoreImpact: "Pilier « Force » — moyenné avec squat, tirage et OHP.",
  },
  hspuStrict: {
    id: "hspuStrict",
    title: "HSPU stricts (set max)",
    estimatedMinutes: "15–30 min",
    category: "Poussée overhead poids du corps",
    equipment: "Mur ou stall bars, abmat optionnel noté de façon fixe",
    measures: "Poussée verticale au poids du corps (distincte de l’OHP chargé).",
    protocol: [
      "Mur défini (même distance mains–mur entre les tests).",
      "Strict : pas de kipping, ligne corporelle maîtrisée.",
    ],
    inputHint: "Nombre max de reps strictes sur un set.",
    commonMistakes: [
      "Courte amplitude en bas.",
      "Changer la hauteur d’abmat entre deux mesures.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — complète dips et OHP.",
  },
  muscleUp2min: {
    id: "muscleUp2min",
    title: "Muscle-ups stricts (2 min)",
    estimatedMinutes: "25–40 min",
    category: "Skill + tirage explosif",
    equipment: "Barre fixe ou anneaux (noter lequel et rester cohérent)",
    measures: "Enchaînement tirage + transition + dip en haut.",
    protocol: [
      "2 minutes chrono : reps complètes avec lockout en haut.",
      "Même support (barre ou anneaux) pour tous les retests.",
    ],
    inputHint: "Nombre de muscle-ups stricts en 2 minutes.",
    commonMistakes: [
      "Grands balanciers pour passer la transition.",
      "Hauteur de barre / hauteur d’anneaux différente sans le noter.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — complète tractions et T2B.",
  },
  echoBikeCal1min: {
    id: "echoBikeCal1min",
    title: "Echo / Assault Bike — calories (1 min)",
    estimatedMinutes: "15–25 min",
    category: "Cardio intense bras + jambes",
    equipment: "Assault / Echo Bike ou équivalent air bike",
    measures: "Puissance glycolytique sur erg spécifique.",
    protocol: [
      "1 minute chrono après échauffement léger.",
      "Noter les calories affichées (arrondi inférieur si décimal).",
    ],
    inputHint: "Nombre entier de calories brûlées en 60 secondes.",
    commonMistakes: [
      "Comparer deux modèles d’erg différents.",
      "Partir trop lentement les 10 premières secondes.",
    ],
    scoreImpact: "Pilier « Cardio intense » — moyenné avec rameur, course courte, etc.",
  },
  echoBike10cal: {
    id: "echoBike10cal",
    title: "Echo Bike — temps 10 calories",
    estimatedMinutes: "15–25 min",
    category: "Cardio intense sprint",
    equipment: "Assault / Echo Bike",
    measures: "Sprint court sur air bike.",
    protocol: [
      "Chronomètre lancé au démarrage, arrêté à 10,0 cal affichées.",
      "Régime de selle habituel.",
    ],
    inputHint: "Temps total mm:ss pour atteindre 10 calories.",
    commonMistakes: [
      "Arrondir visuellement avant d’atteindre 10,0 cal.",
      "Machine en mode incorrect (intervalle vs manual).",
    ],
    scoreImpact: "Pilier « Cardio intense » — complète le test 1 min calories.",
  },
  echoBike30cal: {
    id: "echoBike30cal",
    title: "Echo Bike — temps 30 calories",
    estimatedMinutes: "20–30 min",
    category: "Cardio intense",
    equipment: "Assault / Echo Bike",
    measures: "Effort soutenu court sur air bike.",
    protocol: [
      "Temps pour atteindre exactement 30,0 calories affichées.",
      "Pacing régulier ou sprint selon ton style, mais cohérent au retest.",
    ],
    inputHint: "Temps total mm:ss pour 30 calories.",
    commonMistakes: [
      "S’arrêter avant la validation complète des 30 cal.",
      "Changer le mode d’affichage calories vs watts entre les tests.",
    ],
    scoreImpact: "Pilier « Cardio intense » — moyenné avec 10 cal et 1 min.",
  },
  bulgarianSplitSquat8: {
    id: "bulgarianSplitSquat8",
    title: "Bulgarian split squat ×8/jambe",
    estimatedMinutes: "25–40 min",
    category: "Force unilatérale jambes",
    equipment: "Haltères + banc stable",
    measures: "Charge unilatérale (somme des deux haltères en kg).",
    protocol: [
      "Pied arrière sur banc, même hauteur de banc entre les tests.",
      "8 reps propres par jambe ; saisir la somme des deux haltères (ex. 2×22,5 → 45).",
    ],
    inputHint: "Somme kg des deux haltères pour 8 reps/jambe propres.",
    commonMistakes: [
      "Genou avant qui rentre (valgus excessif).",
      "Amplitude courte sur la jambe faible.",
    ],
    scoreImpact: "Pilier « Force » — complète squats bilatéraux et fentes volume.",
  },
  boxJumpMaxCm: {
    id: "boxJumpMaxCm",
    title: "Box jump — hauteur max (cm)",
    estimatedMinutes: "20–35 min",
    category: "Puissance / SSC",
    equipment: "Caisses empilables ou box jump stable",
    measures: "Hauteur maximale avec réception debout contrôlée.",
    protocol: [
      "Départ debout, saut à deux pieds, réception en extension sur la box.",
      "Hauteur notée = somme des caisses mesurées au ruban (centre de masse stable 1 s).",
    ],
    inputHint: "Hauteur en cm (entier), réception sans genoux à terre.",
    commonMistakes: [
      "Step-up déguisé en saut.",
      "Caisses instables ou empilement dangereux.",
    ],
    scoreImpact: "Pilier « Force » — indicateur puissance / SSC.",
  },
  swim400m: {
    id: "swim400m",
    title: "400 m piscine",
    estimatedMinutes: "40–60 min (avec douche)",
    category: "Endurance / natation",
    equipment: "Piscine 25 ou 50 m (noter la longueur)",
    measures: "Endurance spécifique natation.",
    protocol: [
      "Départ push ou plongeoir selon règlement local, mais cohérent.",
      "400 m crawl de préférence ; sinon nage notée fixe entre les tests.",
    ],
    inputHint: "Temps total mm:ss pour 400 m.",
    commonMistakes: [
      "Comparer 25 m vs 50 m bassin sans le noter.",
      "Combinaison ou pull-buoy qui change entre deux tests.",
    ],
    scoreImpact: "Pilier « Endurance » — moyenné avec course et ergs longs.",
  },
  kbSwing100: {
    id: "kbSwing100",
    title: "100 kettlebell swings (american)",
    estimatedMinutes: "20–30 min",
    category: "Résistance + chaîne postérieure",
    equipment: "Kettlebell 24 kg homme / 16 kg femme (standard protocole)",
    measures: "Volume swing + cardio léger intégré.",
    protocol: [
      "American swing : kettlebell au-dessus de la tête, bras tendus en haut.",
      "100 reps d’affilée, chronomètre arrêté à la 100e rep validée.",
    ],
    inputHint:
      "Temps total mm:ss pour 100 swings. Poids de la kettlebell (kg) dans le champ optionnel si tu t’écartes du standard.",
    commonMistakes: [
      "Russian swing (hauteur épaule) au lieu d’american.",
      "Kettlebell plus lourd que le standard sans le noter.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » — complète air squats et burpees.",
  },
};

export function isPerformanceTestKey(s: string): s is PerformanceTestKey {
  return Object.prototype.hasOwnProperty.call(TEST_PROTOCOLS, s);
}

/** Param `?test=` (ex. `/next-test`) : rejette les clés invalides (`loadNotes`, etc.). */
export function performanceTestKeyFromQuery(
  raw: string | null | undefined,
  fallback: PerformanceTestKey = "row2k",
): PerformanceTestKey {
  const t = raw?.trim() ?? "";
  return isPerformanceTestKey(t) ? t : fallback;
}

export const TEST_PROTOCOL_LIST = (
  Object.keys(TEST_PROTOCOLS) as PerformanceTestKey[]
).map((id) => TEST_PROTOCOLS[id]);
