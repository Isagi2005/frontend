import React from "react";
import { useFormContext } from "react-hook-form";
import { Domaine } from "../../../../api/bulletinApi";


interface TableDomainesEvaluationProps {
  domaines: Domaine[];
  prefix?: string; // utile si tu utilises ce composant dans un formulaire imbriqué
}

const TableDomainesEvaluation: React.FC<TableDomainesEvaluationProps> = ({ domaines, prefix = "evaluations" }) => {
  const { register } = useFormContext();

  return (
    <table className="min-w-full border mt-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">Domaine</th>
          <th className="border px-2 py-1">Note /20</th>
          <th className="border px-2 py-1">Appréciation</th>
          <th className="border px-2 py-1">Observation</th>
        </tr>
      </thead>
      <tbody>
        {domaines.map((domaine, idx) => (
          <tr key={domaine.id}>
            <td className="border px-2 py-1">{domaine.nom}</td>
            <td className="border px-2 py-1">
              <input
                type="number"
                step="0.01"
                min={0}
                max={20}
                {...register(`${prefix}.${idx}.valeurNote`, { required: true, min: 0, max: 20 })}
                className="w-20 border rounded p-1"
              />
              <input
                type="hidden"
                {...register(`${prefix}.${idx}.domaine_id`)}
                value={domaine.id}
              />
            </td>
            <td className="border px-2 py-1">
              <input
                type="text"
                {...register(`${prefix}.${idx}.appreciation`)}
                className="w-full border rounded p-1"
              />
            </td>
            <td className="border px-2 py-1">
              <input
                type="text"
                {...register(`${prefix}.${idx}.observations`)}
                className="w-full border rounded p-1"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableDomainesEvaluation;