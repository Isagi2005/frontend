interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons = ({ setShowForm, setShowPage }: Props) => {
  const handleAdd = (value: string) => {
    if (value === "etudiant") {
      setShowForm(true);
    } else if (value === "excel") {
      setShowPage(true);
    }
  };

  return (
    <select
      className="p-2 border rounded-lg shadow-md bg-white"
      defaultValue="x"
      onChange={(e) => handleAdd(e.target.value)}
    >
      <option value="x">--Action de création--</option>
      <option value="etudiant">Ajouter un étudiant</option>
      <option value="excel">Ajout par un fichier Excel</option>
    </select>
  );
};

export default ActionButtons;
