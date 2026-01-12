import { Check } from "lucide-react";
import { useAddPresEtudiant } from "../../../../hooks/usePresence";
import {
  coursProfile,
  presenceEtudiantProfile,
  VerificationResult,
} from "../../../../api/presenceApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { StudentProfile } from "../../../../api/studentApi";
import { useState } from "react";

interface Props {
  etudiant: StudentProfile | NonNullable<VerificationResult["students_without_presence"]>[0];
  cours: coursProfile;
}

const FormEtudiant = ({ etudiant, cours }: Props) => {
  const { register, handleSubmit, reset, setValue } =
    useForm<presenceEtudiantProfile>();
  const { mutate } = useAddPresEtudiant();
  const [showHeureA, setShowHeureA] = useState(false);
  const [showRaison, setShowRaison] = useState(false);

  const handleChange = (value: string) => {
    if (value === "R") {
      setShowHeureA(true);
      setShowRaison(false);
      setValue("heureA", "");
      setValue("raison", "");
    } else if (value === "A") {
      setShowHeureA(false);
      setShowRaison(true);
      setValue("heureA", ""); // On n'envoie pas heureA pour Absent
    } else {
      setShowHeureA(false);
      setShowRaison(false);
      setValue("heureA", ""); // On n'envoie pas heureA pour Présent
      setValue("raison", "");
    }
  };


  const onSubmit = (data: presenceEtudiantProfile) => {
    // Nettoyage des champs selon le statut
    const payload: Partial<presenceEtudiantProfile> = {
      ...data,
      etudiant: etudiant.id,
      cours: cours.id,
    };
    if (data.statut === "A") {
      delete payload.heureA;
    }
    if (data.statut === "P") {
      delete payload.heureA;
    }
    mutate(
      payload as presenceEtudiantProfile,
      {
        onSuccess: () => {
          toast.success(`Présence enregistrée pour ${etudiant.nom}`);
          reset();
        },
        onError: () => {
          toast.error(
             `Erreur pour ${etudiant.nom}`
          );
        },
      }
    );
  };



  return (
    <tr className="border-b">
      <td className="px-4 py-3 border">
        {`${etudiant.nom} ${etudiant.prenom}`}
      </td>
      <td className="px-4 py-3 border">
        <select
          defaultValue="P"
          {...register("statut", { required: true })}
          onChange={(e) => handleChange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="P">Présent</option>
          <option value="A">Absent</option>
          <option value="R">Retard</option>
        </select>
      </td>
      <td className="px-4 py-3 border">
        {showHeureA && (
          <input
            type="time"
            {...register("heureA", { required: showHeureA })}
            className="border rounded px-2 py-1"
          />
        )}
      </td>
      <td className="px-4 py-3 border">
        {showRaison && (
          <input
            type="text"
            {...register("raison", { required: showRaison })}
            placeholder="Justification"
            className="border rounded px-2 py-1"
          />
        )}
      </td>
      <td className="px-4 py-3 border">{cours.matiere}</td>
      <td className="px-4 py-3 border">
        <button
          type="button"
          className="bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 flex items-center gap-1"
          onClick={handleSubmit(onSubmit)}
        
        >
          <Check size={16} />
          Valider
        </button>
      </td>
    </tr>
  );
};

export default FormEtudiant;
