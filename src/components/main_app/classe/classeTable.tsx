import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ClassProfile } from "../../../api/classApi";
import { Edit, Trash2, Check, Eye, X } from "lucide-react";
import { useDeleteClass, useUpdateClass } from "../../../hooks/useClass";

import ProfCombobox from "./ProfCombobox";
import AnneeCombobox from "./AnneeCombobox";
import { useGetGenerics } from "../../../hooks/useUser";
import { useGet } from "../../../hooks/useAnnee";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dialogue from "../DialogModals";

interface ClassProps {
  displayedData: ClassProfile[];
}

const ClasseTable = ({ displayedData }: ClassProps) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteClass();
  const updateMutation = useUpdateClass();
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { control, register, handleSubmit, reset, setValue } =
    useForm<ClassProfile>();

  const { data: profs = [] } = useGetGenerics("role", "enseignant");
  const { data: annees = [] } = useGet();

  const openModal = (id: number) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const handleEdit = (classe: ClassProfile) => {
    setEditId(classe.id);
    setValue("id", classe.id);
    setValue("nom", classe.nom);
    setValue("titulaire", classe.titulaire);
    setValue("anneeScolaire", classe.anneeScolaire);
    setValue("categorie", classe.categorie);
  };

  const onSubmit = (data: ClassProfile) => {
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
      <table className="w-full bg-white shadow-md rounded-lg border">
        <thead className="bg-gray-800 text-white">
          <tr className="text-center">
            <th className="px-4 py-3 border border-gray-300">Nom</th>
            <th className="px-4 py-3 border border-gray-300">Titulaire</th>
            <th className="px-1 py-3 border border-gray-300">Année scolaire</th>
            <th className="px-4 py-3 border border-gray-300">Categorie</th>
            <th className="px-1 py-3  border border-gray-300">Filles</th>
            <th className="px-1 py-3  border border-gray-300">Garçons</th>
            <th className="px-1 py-3  border border-gray-300">Total</th>

            <th className="px-4 py-3 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="">
          {displayedData?.map((classe) => (
            <tr key={classe.id} className="border-b">
              {editId === classe.id ? (
                <>
                  <td className="px-4 py-3">
                    <input {...register("id")} hidden />
                    <input
                      {...register("nom")}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ProfCombobox
                      name="titulaire"
                      control={control}
                      profs={profs}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <AnneeCombobox
                      name="anneeScolaire"
                      control={control}
                      annees={annees}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Controller
                      name="categorie"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full p-2 focus:outline-none bg-white"
                        >
                          <option value="prescolaire">Prescolaire</option>
                          <option value="primaire">Primaire</option>
                          <option value="college">Collège</option>
                          <option value="lycee">Lycée</option>
                        </select>
                      )}
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
                  <td
                    title="Nom de la classe"
                    className="px-4 py-3 border border-gray-300"
                  >
                    {classe.nom}
                  </td>
                  <td
                    title="Titulaire responsable"
                    className="px-4 py-3 border border-gray-300"
                  >
                    {classe.profName}
                  </td>
                  <td className="px-2 py-3 border border-gray-300">
                    {classe.yearName}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {classe.categorie.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300">
                    {classe.nbrFille}
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300">
                    {classe.nbrGarcon}
                  </td>
                  <td className="px-4 py-3 text-center border border-gray-300">
                    {classe.effectif}
                  </td>

                  <td className="px-4 py-3 text-center flex justify-center gap-4">
                    <button
                      onClick={() => openModal(classe.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(classe)}
                      className="text-blue-500"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => navigate("/home/dashboard/")}
                      className="text-blue-500"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClasseTable;
