import { useState, useMemo } from "react";
import { useEvents } from "../hooks/useEvent";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { Input } from "@headlessui/react";

const AllEvents = () => {
  const { data: events, isLoading, isError } = useEvents();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    // S'assurer que events est un tableau
    const eventsArray = Array.isArray(events) ? events : [];
    
    return eventsArray
      .filter((ev) => 
        ev.titre?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((ev) => {
        if (eventType === "all") return true;
        // Utilisation de typeEvent qui est la propriété correcte selon l'interface EventType
        const eventTypeLower = (ev.typeEvent || '').toLowerCase().trim();
        return eventTypeLower === eventType.toLowerCase().trim();
      })
      .sort((a, b) => {
        const dateA = a.datedebut || a.dateD;
        const dateB = b.datedebut || b.dateD;
        
        if (sortBy === "recent") {
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        } else if (sortBy === "anciens") {
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        }
        return 0;
      });
  }, [events, searchTerm, eventType, sortBy]);

  const handleEvent = (id: number) => navigate(`/event/${id}`);

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500 text-lg font-semibold mt-10">
        Erreur de chargement.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Tous les événements
      </h1>

      {/* 🔍 Filtres */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Rechercher un événement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 rounded-md h-10"
        />

        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="all">Tous les types</option>
          <option value="conférence">Annonces</option>
          <option value="scolaire">Activité para-scolaire</option>
          <option value="formation">Formation</option>
          {/* Ajoute d'autres types ici */}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="recent">Evènement(s) plus récents</option>
          <option value="popular">Evènement(s) plus anciens</option>
        </select>
      </div>

      {/* 🖼️ Carte d'événements */}
      {filteredEvents.length <= 0 ? (
        <p className="text-center text-gray-500">Aucun événement trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((item) => (
            <div
              onClick={() => handleEvent(item.idevenement)}
              key={item.idevenement}
              className="bg-gray-200 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <img
                src={`${import.meta.env.VITE_API_URL}${item.image}`}
                alt={item.titre}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <span className="text-sm text-gray-400">
                  {item.datedebut || item.dateD} - {item.datefin || item.dateF}
                </span>
                <h2 className="text-xl font-semibold text-blue-700 mt-2">
                  {item.titre}
                </h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                    {item.typeEvent || 'Non spécifié'}
                  </span>
                  <button className="text-sm text-blue-600 hover:underline">
                    Détails →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEvents;
