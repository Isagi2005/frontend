import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvent";
import Loading from "./Loading";
import { Calendar, MapPin, ArrowRight, Bell } from "lucide-react";

const HomeEvents = () => {
  const { data: events, isLoading, isError } = useEvents();
  const navigate = useNavigate();
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  // Filtrer les événements par type
  const announcements =
    events?.filter((event) => event.typeEvent === "annonce" && !event.image) ||
    [];

  // Trier les événements réguliers par date et prendre les 3 plus récents
  const sortedRegularEvents = [...(events || [])]
    .filter((event) => !(event.typeEvent === "annonce" && !event.image))
    .sort(
      (a, b) =>
        new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime()
    )
    .slice(0, 3);

  // Rotation automatique des annonces
  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAnnouncementIndex(
        (prevIndex) => (prevIndex + 1) % announcements.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Obtenir le type d'événement avec la bonne couleur
  const getEventTypeInfo = (type: string) => {
    switch (type) {
      case "formation":
        return { label: "Formation", color: "bg-blue-100 text-blue-800" };
      case "annonce":
        return { label: "Annonce", color: "bg-amber-100 text-amber-800" };
      case "scolaire":
        return {
          label: "Activité parascolaire",
          color: "bg-green-100 text-green-800",
        };
      default:
        return { label: type || "Autre", color: "bg-gray-100 text-gray-800" };
    }
  };

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold mt-10">
        Erreur de chargement.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Section des annonces */}
      {announcements.length > 0 && (
        <div className="mb-10">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg overflow-hidden shadow-md">
            <div className="relative p-4 md:p-6">
              {/* Indicateurs de pagination pour les annonces multiples */}
              {announcements.length > 1 && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {announcements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAnnouncementIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentAnnouncementIndex
                          ? "bg-amber-500"
                          : "bg-amber-200"
                      }`}
                      aria-label={`Voir l'annonce ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Contenu de l'annonce */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0 bg-amber-200 rounded-full p-3">
                  <Bell className="h-6 w-6 text-amber-700" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-amber-800 mb-1">
                    {announcements[
                      currentAnnouncementIndex
                    ]?.titre?.toUpperCase()}
                  </h3>
                  <p className="text-amber-700">
                    {announcements[currentAnnouncementIndex]?.description}
                  </p>

                  <div className="mt-3 flex items-center text-sm text-amber-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {formatDate(
                        announcements[currentAnnouncementIndex]?.datedebut
                      )}{" "}
                      -
                      {formatDate(
                        announcements[currentAnnouncementIndex]?.datefin
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/event/${announcements[currentAnnouncementIndex]?.idevenement}`
                    )
                  }
                  className="mt-3 md:mt-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center gap-1 transition-colors text-sm font-medium"
                >
                  <span>Détails</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRegularEvents.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              Aucun événement à afficher pour le moment.
            </div>
          ) : (
            sortedRegularEvents.map((event) => (
              <div
                key={event.idevenement}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
              >
                {/* Image de l'événement avec overlay de type */}
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_API_URL}${event?.image}`}
                    alt={event.titre}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getEventTypeInfo(event.typeEvent).color
                      }`}
                    >
                      {getEventTypeInfo(event.typeEvent).label}
                    </span>
                  </div>
                </div>

                {/* Contenu de l'événement */}
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {event.titre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span>
                        {formatDate(event.datedebut)}
                        {event.datefin !== event.datedebut &&
                          ` - ${formatDate(event.datefin)}`}
                      </span>
                    </div>

                    {event.lieu && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{event.lieu}</span>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/event/${event.idevenement}`)}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Plus d'infos</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeEvents;
