interface FilterItem {
  id: string | number;
  nom: string;
  value?: string;
}

interface FilterProps {
  listData?: FilterItem[];
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
}

const Filter = ({ listData, selectedFilter, setSelectedFilter }: FilterProps) => (
  <select
    className="p-2 border rounded-lg shadow-md bg-white"
    value={selectedFilter}
    onChange={(e) => setSelectedFilter(e.target.value)}
  >
    <option value="">---Sans filtre---</option>
    {listData?.map((data: FilterItem) => (
      <option key={data.id} value={data.value ? data.value : data.nom}>
        {data.nom}
      </option>
    ))}
  </select>
);

export default Filter;
