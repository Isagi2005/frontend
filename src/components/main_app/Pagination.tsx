const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null; // Pas de pagination si une seule page

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Précédent
      </button>

      <span className="px-3 py-1 mx-1">
        {currentPage} / {totalPages}
      </span>

      <button
        className={`px-3 py-1 mx-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
