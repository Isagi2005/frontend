// FairePresence.tsx
import { coursProfile } from "../../../../api/presenceApi";
import UpdatePres from "./UpdatePres";
import FormEtudiant from "./FormEtudiant";
import { useVerification } from "../../../../hooks/usePresence";

interface Props {
  cours: coursProfile;
}

const FairePresence = ({ cours }: Props) => {
  const { data, isLoading, isError } = useVerification(cours.id);

  if (isLoading) return <div>Chargement...</div>;
  if (isError || !data) return <div>Erreur lors de la vérification ou des données incomplètes</div>;

  return (
    <div>
      {data.mode === "update" ? (
        <UpdatePres displayedData={data.presences} />
      ) : (
        <div>
          <h3 className="text-lg font-bold">Faire la présence</h3>
          <table className="w-full bg-white shadow-md rounded-lg border">
            <thead className="bg-slate-50 text-blue-700">
              <tr className="text-center">
                <th className="px-4 py-3 border border-gray-300">ETUDIANT</th>
                <th className="px-1 py-3 border border-gray-300">PRESENCE</th>
                <th className="px-4 py-3 border border-gray-300">
                  HEURE D'ARRIVEE
                </th>
                <th className="px-1 py-3 border border-gray-300">
                  JUSTIFICATION
                </th>
                <th className="px-4 py-3 border border-gray-300">COURS</th>
                <th className="px-4 py-3 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.students_without_presence.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Aucun étudiant sans fiche de présence
                  </td>
                </tr>
              ) : (
                data.students_without_presence.map((etudiant) => (
                  <FormEtudiant
                    key={etudiant.id}
                    etudiant={etudiant}
                    cours={cours}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FairePresence;
