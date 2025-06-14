import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { presenceEtudiantProfile, statut } from "../../../../api/presenceApi";
import { Check, Edit, X } from "lucide-react";
import { useGetPresEtudiant, useUpdatePres } from "../../../../hooks/usePresence";

const UpdatePres = () => {
  const { data: displayedData = [], isLoading } = useGetPresEtudiant();
  const [editId, setEditId] = useState<string | null>(null);
  const updateMutation = useUpdatePres();
  const { register, handleSubmit, reset, setValue } =
    useForm<presenceEtudiantProfile>();
  const [hidden, setHidden] = useState(true);
  const [hidden2, setHidden2] = useState(true);
  const handleChange = (value: statut) => {
    if (value === "R") {
      setHidden(false);
      setHidden2(true);
      setValue("raison", "");
    } else if (value === "A") {
      setHidden(true);
      setHidden2(false);
      setValue("heureA", ""); // On n'envoie pas heureA pour Absent
    } else {
      setHidden(true);
      setHidden2(true);
      setValue("heureA", ""); // On n'envoie pas heureA pour Présent
      setValue("raison", "");
    }
  };

  const handleEdit = (data: presenceEtudiantProfile) => {
    setEditId(data.id);
    setValue("id", data.id);
    setValue("etudiant", data.etudiant);
    setValue("cours", data.cours);
    setValue("statut", data.statut);
    setValue("heureA", data.heureA || "");
    setValue("raison", data.raison || "");
    if (data.statut === "R") {
      setHidden(false);
      setHidden2(true);
    } else if (data.statut === "A") {
      setHidden(true);
      setHidden2(false);
    } else {
      setHidden(true);
      setHidden2(true);
    }
  };

  const onSubmit = (data: presenceEtudiantProfile) => {
    if (editId !== null) {
      // Nettoyage des champs selon le statut
      const payload: Partial<presenceEtudiantProfile> = { ...data };
      if (data.statut === "A") {
        delete payload.heureA;
      }
      if (data.statut === "P") {
        delete payload.heureA;
      }
      
      updateMutation.mutate(
        payload as presenceEtudiantProfile,
        {
          onSuccess: () => {
            toast.success("Modification reussie !");
            reset()
            setEditId(null);
          },
          onError: (err: { response?: { data?: { detail?: string } } }) => {
            toast.error(err?.response?.data?.detail || "Echec de la modification!");
          },
        }
      );
    }
  };


  const handleCancel = () => {
    setEditId(null);
    reset();
  };

  // Récupérer les infos du cours pour l'en-tête PDF (on suppose qu'elles sont dans displayedData[0])
  const coursInfo = displayedData && displayedData[0]
    ? {
        matiere: displayedData[0].coursName || '',
        classe: displayedData[0].classeName || '',
        date: displayedData[0].coursDate || '',
      }
    : { matiere: '', classe: '', date: '' };

  // Préparer les données pour le PDF
  const handleExportPDF = () => {
    // Import dynamique pour éviter d'alourdir le bundle principal
    import("./exportPresencePDF").then(({ exportPresencePDF }) => {
      exportPresencePDF(
        displayedData.map(p => ({
          etudiantName: p.etudiantName,
          statut: p.statut,
          heureA: p.heureA,
          raison: p.raison,
        })),
        coursInfo
      );
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <h3 className="mb-2 text-lg font-bold">FICHE DE PRESENCE FAIT(S)</h3>
      {displayedData && displayedData.length > 0 && (
        <button
          onClick={handleExportPDF}
          className="mb-4 px-4 py-2 border border-gray-700 rounded bg-white hover:bg-gray-100 text-gray-900 font-semibold"
        >
          Exporter PDF
        </button>
      )}
      <table className="w-full bg-white shadow-md rounded-lg border">
        <thead className="bg-slate-50 text-blue-700">
          <tr className="text-center">
            <th className="px-4 py-3 border border-gray-300">ETUDIANTS</th>
            <th className="px-4 py-3 border border-gray-300">PRESENCE</th>
            <th className="px-4 py-3 border border-gray-300">
              HEURE D'ARRIVEE
            </th>
            <th className="px-1 py-3 border border-gray-300">JUSTIFICATION</th>
            <th className="px-4 py-3 border border-gray-300">COURS</th>
            <th className="px-4 py-3 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="">
          {displayedData === null ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                Chargement...
              </td>
            </tr>
          ) : displayedData.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                Aucun évènement correspondant
              </td>
            </tr>
          ) : (
            displayedData?.map((presence) => (
              <tr key={presence.id} className="border-b">
                {editId === presence.id ? (
                  <>
                    <td className="px-4 py-3 border">{presence.etudiant}</td>
                    <td className="px-4 py-3 border">
                      <select
                        defaultValue={presence.statut}
                        {...register("statut")}
                        onChange={(e) => handleChange(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="P">Présent</option>
                        <option value="A">Absent</option>
                        <option value="R">Retard</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 border">
                      {hidden == false && (
                        <input
                          type="time"
                          {...register("heureA")}
                          className="border rounded px-2 py-1"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 border">
                      {hidden2 == false && (
                        <textarea
                          {...register("raison")}
                          rows={2}
                          className="border rounded px-2 py-1 w-full"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 border">
                      {presence.cours}
                      {/* champ caché pour le cours */}
                      <input
                        type="hidden"
                        value={presence.cours}
                        {...register("cours")}
                      />
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-4">
                      <button
                        onClick={handleSubmit(onSubmit)}
                        className="text-green-500"
                      >
                        <Check size={20} />
                      </button>
                      <button onClick={handleCancel} className="text-gray-500">
                        <X size={20} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 border">
                      {presence.etudiantName}
                    </td>
                    <td className="px-4 py-3 border text-white">
                      <div></div>
                      <div
                        className={`${
                          presence.statut === "P" || presence.statut === "A"
                            ? presence.statut === "P"
                              ? "bg-green-500"
                              : "bg-red-700"
                            : "bg-yellow-500 text-black"
                        } w-6 h-auto text-center rounded-full ml-6`}
                      >
                        {presence.statut}
                      </div>
                    </td>
                    <td className="px-4 py-3 border">{presence.heureA}</td>
                    <td className="px-4 py-3 border">{presence.raison}</td>
                    <td className="px-4 py-3 border">{presence.coursName}</td>
                    <td className="px-4 py-3 border text-center">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(presence)}
                      >
                        <Edit size={20} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UpdatePres;
