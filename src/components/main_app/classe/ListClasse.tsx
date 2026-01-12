import { useState } from "react";
import { useGetClass } from "../../../hooks/useClass";
import ClasseTable from "./classeTable";
import Pagination from "../Pagination";
import Loading from "../../Loading";
import ClassModals from "./classModals";
import SearchBar from "../SearchBar";
import Filter from "../Filter";
import { classFilter } from "../../../dataMenu/filterItem";

const ListClasse = () => {
  const { data: listDeClasse, isLoading: load } = useGetClass();
  const [search, setSearch] = useState("");
  const [showPage, setShowPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const itemsPerPage = 5;
  const filteredClasse = listDeClasse?.filter((classe) => {
    const matchesSearch =
      `${classe.nom} ${classe.profName} ${classe.yearName} ${classe.categorie}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesClass = selectedFilter
      ? classe.categorie === selectedFilter.toLowerCase()
      : true;
    return matchesSearch && matchesClass;
  });

  const totalPages = Math.ceil((filteredClasse?.length || 0) / itemsPerPage);
  const displayedClasse = filteredClasse?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="pl-10">
      <ClassModals showPage={showPage} setShowPage={setShowPage} />
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex justify-end ">
          <button
            onClick={() => setShowPage(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Nouvelle classe
          </button>
        </div>
        <SearchBar search={search} setSearch={setSearch} />

        <Filter
          listData={classFilter}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      </div>
      {load ? <Loading /> : <ClasseTable displayedData={displayedClasse || []} />}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
export default ListClasse;
