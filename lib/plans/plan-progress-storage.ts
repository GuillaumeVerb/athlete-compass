/**
 * Suivi local des cases cochées sur /plan (même empreinte profil + scoring).
 */

const KEY = "ac_plan_progress_v1";

type Entry = {
  /** Indices 0..n-1 alignés sur objectiveChecks de la semaine. */
  objectiveChecks: boolean[];
  /** Indices 0..m-1 alignés sur sessions de la semaine. */
  sessionDone: boolean[];
};

type Root = {
  v: 1;
  /** clé fingerprint::w{week} → entrée */
  weeks: Record<string, Entry>;
};

function emptyRoot(): Root {
  return { v: 1, weeks: {} };
}

function loadRoot(): Root {
  if (typeof window === "undefined") return emptyRoot();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyRoot();
    const p = JSON.parse(raw) as Root;
    if (p?.v !== 1 || typeof p.weeks !== "object" || p.weeks == null) {
      return emptyRoot();
    }
    return p;
  } catch {
    return emptyRoot();
  }
}

function saveRoot(root: Root) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(root));
}

function weekKey(fingerprint: string, weekNum: number): string {
  return `${fingerprint}::w${weekNum}`;
}

export function loadPlanProgressEntry(
  fingerprint: string,
  weekNum: number,
  objectiveCount: number,
  sessionCount: number,
): Entry {
  const root = loadRoot();
  const raw = root.weeks[weekKey(fingerprint, weekNum)];
  const obj = Array.isArray(raw?.objectiveChecks)
    ? raw.objectiveChecks.slice(0, objectiveCount)
    : [];
  const sess = Array.isArray(raw?.sessionDone)
    ? raw.sessionDone.slice(0, sessionCount)
    : [];
  while (obj.length < objectiveCount) obj.push(false);
  while (sess.length < sessionCount) sess.push(false);
  return { objectiveChecks: obj, sessionDone: sess };
}

export function savePlanProgressObjective(
  fingerprint: string,
  weekNum: number,
  index: number,
  checked: boolean,
  objectiveCount: number,
  sessionCount: number,
) {
  const root = loadRoot();
  const k = weekKey(fingerprint, weekNum);
  const cur = loadPlanProgressEntry(
    fingerprint,
    weekNum,
    objectiveCount,
    sessionCount,
  );
  const nextObj = [...cur.objectiveChecks];
  nextObj[index] = checked;
  root.weeks[k] = {
    objectiveChecks: nextObj,
    sessionDone: cur.sessionDone,
  };
  saveRoot(root);
}

export function savePlanProgressSession(
  fingerprint: string,
  weekNum: number,
  sessionIndex: number,
  checked: boolean,
  objectiveCount: number,
  sessionCount: number,
) {
  const root = loadRoot();
  const k = weekKey(fingerprint, weekNum);
  const cur = loadPlanProgressEntry(
    fingerprint,
    weekNum,
    objectiveCount,
    sessionCount,
  );
  const nextSess = [...cur.sessionDone];
  nextSess[sessionIndex] = checked;
  root.weeks[k] = {
    objectiveChecks: cur.objectiveChecks,
    sessionDone: nextSess,
  };
  saveRoot(root);
}
