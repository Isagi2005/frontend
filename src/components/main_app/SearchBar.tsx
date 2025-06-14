import { Search } from "lucide-react";

const SearchBar = ({ search, setSearch }) => (
  <div className="flex items-center border rounded-lg overflow-hidden shadow-md">
    <span className="p-2 bg-gray-100">
      <Search size={18} className="text-gray-500" />
    </span>
    <input
      type="text"
      placeholder="Rechercher..."
      className="p-2 focus:outline-none"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
);

export default SearchBar;
