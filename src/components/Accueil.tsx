import { useState, useEffect } from "react"
import type { accueilType } from "../api/siteApi"
import { ChevronDown } from "lucide-react"

interface PageProps {
  data: accueilType
}

const Accueil = ({ data }: PageProps) => {
  const imagesbackend = [data.image1, data.image2, data.image3].filter(
  (img): img is string => typeof img === "string" && img.trim() !== ""
)
  const [currentImage, setCurrentImage] = useState(0)
  const [fade, setFade] = useState(true)
  const [showFullText, setShowFullText] = useState(false)

 useEffect(() => {
  if (imagesbackend.length === 0) return

  const interval = setInterval(() => {
    setFade(false)
    setTimeout(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % imagesbackend.length)
      setFade(true)
    }, 500)
  }, 10000)

  return () => clearInterval(interval)
}, [imagesbackend.length])

  return (
    <div
      className={`mt-20 relative w-full h-screen flex items-center justify-center bg-cover bg-center transition-opacity duration-1000 ${
        fade ? "opacity-100" : "opacity-0"
        }`}
      style={{backgroundImage:
    imagesbackend.length > 0 ? `url(${imagesbackend[currentImage]})` : "none",
}}
    >
      <div className="absolute inset-0  bg-black/60"></div>
      <div className="relative z-10 text-center text-white px-6 max-w-3xl">
        {/* Titre toujours visible */}
        <h1 className="text-4xl md:text-6xl text-emerald-100 font-mono font-bold mb-6">{data.titre}</h1>

        {/* Texte conditionnel */}
        {showFullText ? (
          <div className="transition-all duration-500 ease-in-out">
            <p className="text-lg md:text-xl mb-8 text-yellow-50 leading-relaxed">{data.texteAccueil}</p>
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
        {imagesbackend.map((_, index) => (
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
  )
}

export default Accueil
