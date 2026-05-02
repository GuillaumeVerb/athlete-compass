import type { EquivTableRow } from "@/lib/equipment/equivalences";

export function EquivalenceTable({ rows }: { rows: EquivTableRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-surface text-[10px] font-medium uppercase tracking-wider text-muted">
          <tr>
            <th className="w-44 px-3 py-3">Scénario</th>
            <th className="px-3 py-3">Rameur</th>
            <th className="px-3 py-3">SkiErg</th>
            <th className="px-3 py-3">Vélo / BikeErg</th>
            <th className="px-3 py-3">Assault</th>
            <th className="px-3 py-3">Tapis incliné</th>
            <th className="px-3 py-3">Course</th>
            <th className="px-3 py-3">Autre</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={row.id}
              className={
                row.locked ? "bg-background/30 opacity-55" : "bg-background/40"
              }
            >
              <td className="px-3 py-3 align-top font-medium text-foreground">
                {row.scenario}
              </td>
              <td className="px-3 py-3 align-top text-muted">{row.rower}</td>
              <td className="px-3 py-3 align-top text-muted">{row.skierg}</td>
              <td className="px-3 py-3 align-top text-muted">{row.bike}</td>
              <td className="px-3 py-3 align-top text-muted">
                {row.assaultBike}
              </td>
              <td className="px-3 py-3 align-top text-muted">
                {row.inclineTread}
              </td>
              <td className="px-3 py-3 align-top text-muted">{row.run}</td>
              <td className="px-3 py-3 align-top text-muted">{row.other}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
