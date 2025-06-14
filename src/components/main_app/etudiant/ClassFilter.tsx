import { ClassProfile } from "../../../api/classApi";
import { filterProps } from "../../../dataMenu/filterItem";

interface Props {
  listClasse: ClassProfile[] | filterProps[];
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
}

const ClassFilter = ({
  listClasse,
  selectedClass,
  setSelectedClass,
}: Props) => (
  <select
    className="p-2 border rounded-lg shadow-md bg-white"
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
  >
    <option value="">Toutes les classes</option>
    {listClasse?.map((classe) => (
      <option key={classe.id} value={classe.nom}>
        {classe.nom}
      </option>
    ))}
  </select>
);

export default ClassFilter;
