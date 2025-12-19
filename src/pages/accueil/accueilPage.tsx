
import { useState, useEffect } from "react"
import image1 from "../../assets/bd/bd12.jpg"
import image2 from "../../assets/bd/bd13.jpg"
import image3 from "../../assets/bd/bd14.jpg"
import image4 from "../../assets/bd/bd15.jpg"
import { useNavigate } from "react-router-dom"
import { useGetAccueil } from "../../hooks/useSite"
import Accueil from "../../components/Accueil"
import HomeEvents from "../../components/EvenementsScroll"
import { ChevronDown } from "lucide-react"
import SchoolPresentation from "./SchoolPresentation"

const images = [image1, image2, image3, image4]
const texte: string =
  "Nous sommes ravis de vous accueillir au cœur de notre établissement," +
  " situé à ByPass Alasora Antananarivo, Madagascar. Notre école, qui" +
  " allie tradition et innovation, met tout en œuvre pour offrir à" +
  " chaque élève une éducation de qualité, fondée sur des valeurs" +
  " humaines et un enseignement adapté aux enjeux du monde moderne. Nous" +
  " suivons le système éducatif Français."

const AccueilPage = () => {
  const { data: listData, isLoading: loadData, isError } = useGetAccueil()
  const navigate = useNavigate()
  const hasBackendImages =
  !!listData &&
  listData.length > 0 &&
  listData.some((item) => {
    const img1 = item.image1
    const img2 = item.image2
    const img3 = item.image3

    const hasImg1 =
      typeof img1 === "string" ? img1.trim() !== "" : img1 instanceof File
    const hasImg2 =
      typeof img2 === "string" ? img2.trim() !== "" : img2 instanceof File
    const hasImg3 =
      typeof img3 === "string" ? img3.trim() !== "" : img3 instanceof File

    return hasImg1 || hasImg2 || hasImg3
  })
  // États pour l'affichage des données fictives
  const [currentImage, setCurrentImage] = useState(0)
  const [fade, setFade] = useState(true)
  const [showFullText, setShowFullText] = useState(false)

  useEffect(() => {
    // Effet pour le diaporama des données fictives
    if (loadData || isError) {
      const interval = setInterval(() => {
        setFade(false)
        setTimeout(() => {
          setCurrentImage((prevIndex) => (prevIndex + 1) % images.length)
          setFade(true)
        }, 500)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [loadData, isError])
  console.log({
  loadData,
  isError,
  hasBackendImages,
  listData,
})

  return (
    <>
      {loadData || isError || !hasBackendImages ? (
        // Affichage direct des données fictives avec le même style que le composant Accueil
        <div
          className={`mt-20 relative w-full h-screen flex items-center justify-center bg-cover bg-center transition-opacity duration-1000 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${images[currentImage]})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center text-white px-6 max-w-3xl">
            {/* Titre toujours visible */}
            <h1 className="text-4xl md:text-6xl text-emerald-100 font-mono font-bold mb-6">
              Bienvenue sur le site de l'établissement Raitra Kidz!
            </h1>

            {/* Texte conditionnel */}
            {showFullText ? (
              <div className="transition-all duration-500 ease-in-out">
                <p className="text-lg md:text-xl mb-8 text-yellow-50 leading-relaxed">{texte}</p>
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full transition-colors duration-300"
                  onClick={() => setShowFullText(false)}
                >
                  Masquer le texte
                </button>
              </div>
            ) : (
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full flex items-center mx-auto transition-colors duration-300"
                onClick={() => setShowFullText(true)}
              >
                <span className="mr-2">En savoir plus</span>
                <ChevronDown size={20} />
              </button>
            )}
          </div>

          {/* Indicateurs de diaporama */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentImage === index ? "bg-emerald-400 w-6" : "bg-white bg-opacity-50"
                }`}
                onClick={() => {
                  setFade(false)
                  setTimeout(() => {
                    setCurrentImage(index)
                    setFade(true)
                  }, 500)
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        // Utilisation du composant Accueil pour les données du backend
        listData?.map((item) => <Accueil key={item.id} data={item} />)
      )}

      {/* Section de présentation */}
      <SchoolPresentation />

      {/* Section des événements */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Les évènements passés</h2>

        <HomeEvents />
        <button
          onClick={() => navigate("/event/")}
          className="bg-orange-400 text-blue-600 px-4 py-2 mt-5 rounded-lg text-sm hover:bg-orange-300 transition"
        >
          Plus d'évènements
        </button>
      </section>
    </>
  )
}

export default AccueilPage
