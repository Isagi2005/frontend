import Loading from "../../../Loading";
import SearchBar from "../../SearchBar";
import Filter from "../../Filter";
import Pagination from "../../Pagination";
import { useState } from "react";
import { useGetCours } from "../../../../hooks/usePresence";
import { classFilter } from "../../../../dataMenu/filterItem";
import TableCours from "./TableCours";
import AjoutCours from "./AjoutCours";
import { X } from "lucide-react";

const TransitionPresence = () => {
  const { data: listCours, isLoading: loadCours, isError } = useGetCours();
  const [search, setSearch] = useState("");
  const [showPage, setShowPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const itemsPerPage = 5;
  const filteredData = listCours?.filter((cour) => {
    const matchesSearch =
      `${cour.matiere} ${cour.date} ${cour.heureDebut} ${cour.classe}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const displayedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <div className="pl-10">
        {showPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
            <div className="relative bg-white w-full max-w-3xl mx-4 sm:mx-auto rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
              {/* Bouton de fermeture en haut à droite */}
              <button
                onClick={() => setShowPage(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
                aria-label="Fermer"
              >
                <X size={24} />
              </button>

              {loadCours || isError ? "Chargement..." : <AjoutCours />}
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="w-full md:w-auto">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Filter
              listData={classFilter}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />

            <button
              onClick={() => setShowPage(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              + Nouvelle Cours
            </button>
          </div>
        </div>
        {loadCours ? <Loading /> : <TableCours displayedData={displayedData} />}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};
export default TransitionPresence;
