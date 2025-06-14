import { useState } from "react";
import Pagination from "../Pagination";
import Loading from "../../Loading";

import SearchBar from "../SearchBar";
import Filter from "../Filter";
import { classFilter } from "../../../dataMenu/filterItem";
import { useEvents } from "../../../hooks/useEvent";
import TableEvent from "./TableEvent";
import EventModals from "./eventModals";

const ListEvent = () => {
  const { data: ListEvent, isLoading: load } = useEvents();
  const [search, setSearch] = useState("");
  const [showPage, setShowPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const itemsPerPage = 5;
  const filteredData = ListEvent?.filter((event) => {
    const matchesSearch =
      `${event.titre} ${event.dateD} ${event.dateF} ${event.description}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesClass = selectedFilter
      ? event.titre === selectedFilter.toLowerCase()
      : true;
    return matchesSearch && matchesClass;
  });

  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const displayedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="pl-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <EventModals showPage={showPage} setShowPage={setShowPage} />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Publier une nouvelle evenement
          </button>
        </div>
      </div>
      {load ? <Loading /> : <TableEvent displayedData={displayedData} />}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
export default ListEvent;
