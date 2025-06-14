import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { coursProfile } from "../../../../api/presenceApi";
import { useDeleteCours, useUpdateCours } from "../../../../hooks/usePresence";
import Dialogue from "../../DialogModals";
import PresenceModal from "./PresenceModal";
import ListPresenceModal from "./ListPresenceModal";

interface coursProps {
  displayedData: coursProfile[];
}

const TableCours = ({ displayedData }: coursProps) => {

  const [editId, setEditId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [ismodalOpen, setOpenModal] = useState(false);
  const [presence, setPresence] = useState(false);
  const [cours, setCoursId] = useState<coursProfile | null>(null);
  const deleteMutation = useDeleteCours();
  const updateMutation = useUpdateCours();
  const { register, handleSubmit, reset, setValue, control } =
    useForm<coursProfile>();

  const openModal = (id: string) => {
    setSelectedId(id);
    setIsOpen(true);
  };
  const openList = (cour: coursProfile) => {
    setCoursId(cour);
    setPresence(true);
  };

  const handleEdit = (cour: coursProfile) => {
    setEditId(cour.id);
    setValue("id", cour.id);
    setValue("enseignant", cour.enseignant);
    setValue("date", cour.date);
    setValue("heureDebut", cour.heureDebut);
    setValue("heureFin", cour.heureFin);
  };

  const OpenPresence = (cour: coursProfile) => {
    setCoursId(cour);
    setOpenModal(true);
  };

  const onSubmit = (data: coursProfile) => {
    if (editId !== null) {
      updateMutation.mutate(
        { ...data },
        {
          onSuccess: () => {
            toast.success("Modification reussit !");
            setEditId(null);
          },
          onError: () => {
            toast.error("Echec de la modification!");
          },
        }
      );
      reset();
    }
  };

  const handleCancel = () => {
    setEditId(null);
    reset();
  };

  return (
    <div className="w-full overflow-x-auto">
      {isOpen && (
        <Dialogue
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          mutation={deleteMutation}
        />
      )}
      {ismodalOpen && (
        <PresenceModal
          showPage={ismodalOpen}
          setShowPage={setOpenModal}
          cour={cours}
        />
      )}
      {presence && (
        <ListPresenceModal
          showPage={presence}
          setShowPage={setPresence}
          cour={cours}
        />
      )}
      <table className="w-full bg-white shadow-md rounded-lg border">
        <thead className="bg-slate-50 text-blue-700">
          <tr className="text-center">
            <th className="px-4 py-3 border border-gray-300">DATE DU COURS</th>
            <th className="px-4 py-3 border border-gray-300">HEURE DEBUT</th>
            <th className="px-1 py-3 border border-gray-300">HEURE FIN</th>
            <th className="px-4 py-3 border border-gray-300">ENSEIGNANT</th>
            <th className="px-4 py-3 border border-gray-300">CLASSE</th>
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
                Aucun cours enregistré pour le moment
              </td>
            </tr>
          ) : (
            displayedData?.map((cour) => (
              <tr key={cour.id} className="border-b">
                {editId === cour.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input {...register("id")} hidden />
                      <input
                        type="date"
                        {...register("date")}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        {...register("heureDebut")}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        {...register("heureFin")}
                        className="border rounded px-2 py-1 w-full"
                        type="time"
                      />
                    </td>
                    <td className="px-4 py-3">Inchangeable</td>


                    <td className="px-4 py-3">Inchangeable</td>

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
                    <td className=" text-center px-4 py-3 border border-gray-300">
                      {cour.dateFormatte}
                    </td>
                    <td className="text-center px-4 py-3 border border-gray-300">
                      {cour.heureDebut}
                    </td>
                    <td className="text-center px-2 py-3 border border-gray-300">
                      {cour.heureFin}
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      {cour.enseignantNom}
                    </td>


                    <td className="text-center px-4 py-3 border border-gray-300">
                      {cour.classeNom}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-4">
                      <button
                        onClick={() => openModal(cour.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={() => handleEdit(cour)}
                        className="text-blue-500"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => OpenPresence(cour)}
                        className="text-white bg-blue-600 px-2 py-2 rounded-md
                        "
                      >
                        Faire une presence
                      </button>
                      <button
                        onClick={() => openList(cour)}
                        className="text-white bg-blue-600 px-2 py-2 rounded-md
                        "
                      >
                        Voir le fiche de presence
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

export default TableCours;
