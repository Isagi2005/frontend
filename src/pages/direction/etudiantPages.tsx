import ListEtudiant from "../../components/main_app/etudiant/ListEtudiant";
import { useGetClass } from "../../hooks/useClass";

const EtudiantPage = () => {
  const { data: listClasse, isLoading, isError } = useGetClass();
  return (
    <div className="mt-7">
      {!isError || !isLoading ? (
        <ListEtudiant listClasse={listClasse} />
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};
export default EtudiantPage;
