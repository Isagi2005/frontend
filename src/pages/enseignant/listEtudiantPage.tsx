import ListEtudiant from "../../components/main_app/etudiant/ListEtudiant";
import { useGetClass } from "../../hooks/useClass";

const ListEtudiantPage = () => {
  const {data: listClasse, isLoading, isError} = useGetClass()
  return (
    <div className="mt-10">
      {isLoading && <p>Chargement...</p>}
      {isError && <p>Erreur lors du chargement</p>} 
      <ListEtudiant listClasse={listClasse} />
    </div>
  );
};
export default ListEtudiantPage;
