const SortSelect = ({ data, sortBy, setSortBy }) => (
  <select
    className="p-2 border rounded-lg shadow-md bg-white"
    onChange={(e) => setSortBy(e.target.value)}
    value={sortBy}
  >
    {data.map((item,idx) => (
      <option value={item.nom} key={idx}>{item.texte}</option>
    ))}
  </select>
);

export default SortSelect;
