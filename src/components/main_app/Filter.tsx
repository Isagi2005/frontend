const Filter = ({ listData, selectedFilter, setSelectedFilter }) => (
  <select
    className="p-2 border rounded-lg shadow-md bg-white"
    value={selectedFilter}
    onChange={(e) => setSelectedFilter(e.target.value)}
  >
    <option value="">---Sans filtre---</option>
    {listData?.map((data: any) => (
      <option key={data.id} value={data.value ? data.value : data.nom}>
        {data.nom}
      </option>
    ))}
  </select>
);

export default Filter;
