import { useState } from "react";
import InscriptionCard from "../../components/main_app/contenu/inscription";
import { useGetInscription } from "../../hooks/useSite";
import SearchBar from "../../components/main_app/SearchBar";
import Pagination from "../../components/main_app/Pagination";
import { demandeFilter } from "../../dataMenu/filterItem";
import Filter from "../../components/main_app/Filter";

const Demandes = () => {
  const { data: demandes } = useGetInscription();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "ancien">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");

  const itemsPerPage = 5;

  const filteredData = demandes?.filter((demande) => {
    if (demande != null) {
      const matchesSearch =
        `${demande.nomEleve} ${demande.prenomEleve} ${demande.classeDemande} ${demande.contactParent} ${demande.date}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesClass = selectedFilter
        ? demande.statut === selectedFilter
        : true;
      return matchesSearch && matchesClass;
    }
    return false;
  });

  const sortedEtudiants = filteredData?.sort((a, b) => {
    const dateA = new Date(a.dateDeDemande).getTime();
    const dateB = new Date(b.dateDeDemande).getTime();
    return sortBy === "recent" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil((sortedEtudiants?.length || 0) / itemsPerPage);
  const displayedData = sortedEtudiants?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Liste des demandes d’inscription
      </h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="w-full xl:ml-96 md:w-auto">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
        <div className="flex flex-col xl:mr-96 sm:flex-row gap-3 w-full md:w-auto">
          <Filter
            listData={demandeFilter}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "ancien")}
          >
            <option value="recent">Trier par date: Date récente</option>
            <option value="ancien">Trier par date: Date ancienne</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {displayedData?.length > 0 ? (
          displayedData?.map((demande) => (
            <InscriptionCard key={demande.id} demande={demande} />
          ))
        ) : (
          <p>Aucun demande pour le moment</p>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Demandes;
