import { useNavigate, useParams } from "react-router-dom";
import { GetOneEvent, useEvents } from "../hooks/useEvent";
import type { EventType } from "../api/eventApi";
import Loading from "../components/Loading";
import AllEvents from "./AllEvent";
import { ArrowLeft } from "lucide-react";

// Using EventType from eventApi

const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = Number(id);

  // Fetch current event
  const { data: event, isLoading, isError } = GetOneEvent(eventId) as { data: EventType | undefined, isLoading: boolean, isError: boolean };

  // Fetch all events for navigation
  const { data: allEvents = [] } = useEvents() as { data: EventType[] };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500 text-lg font-semibold p-6 bg-red-50 rounded-lg max-w-md mx-auto">
          Erreur de chargement de l'événement.
        </div>
      </div>
    );
  }

  // Find current index and calculate prev/next
  const currentIndex = allEvents.findIndex((e) => e.idevenement === eventId);
  const prevEvent = currentIndex > 0 ? allEvents[currentIndex - 1] : null;
  const nextEvent = currentIndex < allEvents.length - 1 ? allEvents[currentIndex + 1] : null;

  const handleNavigate = (id: number) => {
    navigate(`/event/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 text-black bg-transparent rounded-lg hover:bg-white transition shadow-md md:top-6 md:left-6"
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
      </div>
      {id ? (
        <div className="mt-7 max-w-6xl mx-auto ">
          {/* Event Content */}
          <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-xl shadow-md overflow-hidden">
            {/* Left Column - Image */}
            <div className="lg:w-1/2">
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-full overflow-hidden">
                <img
                  src={event?.image && typeof event.image === 'string' ? event.image : '/placeholder-event.jpg'}
                  alt={event?.titre || 'Événement'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-event.jpg';
                  }}
                />
                {/* Mobile date overlay */}
                <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
                  <div className="text-white flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      <span>{event?.datedebut} {event?.datefin && `au ${event.datefin}`}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:w-1/2 p-6 md:p-8 flex flex-col">
              {/* Title and date (desktop) */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {event?.titre}
                </h1>
                <div className="hidden lg:flex items-center text-gray-600 space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    <span>{event?.datedebut} {event?.datefin && `au ${event.datefin}`}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none text-gray-700 mb-8 grow">
                <h2 className="text-xl font-semibold text-orange-600 mb-4">
                  Description
                </h2>
                <p className="leading-relaxed">{event?.description}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-orange-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Lieu
                  </h3>
                  <p className="text-gray-600">{event?.lieu || "À préciser"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-orange-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Organisateur
                  </h3>
                  <p className="text-gray-600">RAITRA Kidz</p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                {prevEvent ? (
                  <button
                    onClick={() => handleNavigate(prevEvent.idevenement)}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Précédent
                  </button>
                ) : (
                  <div className="w-24"></div>
                )}

                {nextEvent ? (
                  <button
                    onClick={() => handleNavigate(nextEvent.idevenement)}
                    className="flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Suivant
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <div className="w-24"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AllEvents />
      )}
    </div>
  );
};

export default EventPage;
