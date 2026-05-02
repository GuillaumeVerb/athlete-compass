import type { EquivTableRow } from "@/lib/equipment/equivalences";

export function EquivalenceTable({ rows }: { rows: EquivTableRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#252a36]">
      <table className="w-full text-sm text-left min-w-[920px]">
        <thead className="bg-[#12151c] text-[#9aa3b8] text-[10px] uppercase tracking-wider">
          <tr>
            <th className="px-3 py-3 w-44">Scénario</th>
            <th className="px-3 py-3">Rameur</th>
            <th className="px-3 py-3">SkiErg</th>
            <th className="px-3 py-3">Vélo / BikeErg</th>
            <th className="px-3 py-3">Assault</th>
            <th className="px-3 py-3">Tapis incliné</th>
            <th className="px-3 py-3">Course</th>
            <th className="px-3 py-3">Autre</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#252a36]">
          {rows.map((row) => (
            <tr
              key={row.id}
              className={row.locked ? "opacity-55 bg-[#0a0c10]/30" : "bg-[#0a0c10]/40"}
            >
              <td className="px-3 py-3 font-medium text-white align-top">
                {row.scenario}
              </td>
              <td className="px-3 py-3 text-[#c5cad8] align-top">{row.rower}</td>
              <td className="px-3 py-3 text-[#c5cad8] align-top">{row.skierg}</td>
              <td className="px-3 py-3 text-[#c5cad8] align-top">{row.bike}</td>
              <td className="px-3 py-3 text-[#c5cad8] align-top">
                {row.assaultBike}
              </td>
              <td className="px-3 py-3 text-[#c5cad8] align-top">
                {row.inclineTread}
              </td>
              <td className="px-3 py-3 text-[#c5cad8] align-top">{row.run}</td>
              <td className="px-3 py-3 text-[#c5cad8] align-top">{row.other}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
