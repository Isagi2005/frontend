interface SortItem {
  nom: string;
  texte: string;
}

interface SortSelectProps {
  data: SortItem[];
  sortBy: string;
  setSortBy: (value: string) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ data, sortBy, setSortBy }) => (
  <select
    className="p-2 border rounded-lg shadow-md bg-white"
    onChange={(e) => setSortBy(e.target.value)}
    value={sortBy}
  >
    {data.map((item: SortItem, idx: number) => (
      <option value={item.nom} key={idx}>
        {item.texte}
      </option>
    ))}
  </select>
);

export default SortSelect;
