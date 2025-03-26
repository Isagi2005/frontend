import { useEvents } from "../hooks/useEvent";
import Loading from "./Loading";

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold mt-10">
        Erreur de chargement.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
          >
            <img
              src={`${import.meta.env.VITE_API_URL}${item.image}`}
              alt={item.titre}
              className="w-full h-60 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-bold text-orange-600 mb-2">
                {item.titre}
              </h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                Voir plus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
