import type React from "react"
import { useRef, useState, useEffect } from "react"
import { PlusCircle, Edit, Trash2, X, Save, Mail, FileText, ImageIcon, Loader2, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAddRecrutement, useDeleteRecrutement, useGetRecrutement, useUpdateRecrutement } from "../../hooks/useRecrutement"

const RecrutementAdminPage = () => {
  const { data, isLoading } = useGetRecrutement()
  const addMutation = useAddRecrutement()
  const updateMutation = useUpdateRecrutement()
  const deleteMutation = useDeleteRecrutement()

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Réinitialiser l'image actuelle quand on annule la sélection
    if (!selectedId) {
      setCurrentImage(null)
      setPreviewImage(null)
    }
  }, [selectedId])

  // Prévisualisation de l'image sélectionnée
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewImage(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()

    // Ne pas envoyer les champs vides lors de la modification
    if (selectedId) {
      if (descriptionRef.current?.value) {
        formData.append("description", descriptionRef.current.value)
      }
      if (emailRef.current?.value) {
        formData.append("email", emailRef.current.value)
      }
      if (imageRef.current?.files?.[0]) {
        formData.append("image", imageRef.current.files[0])
      } else if (currentImage === null) {
        // Pour supprimer l'image si elle a été retirée
        formData.append("image", "")
      }
    } else {
      // Pour la création, tous les champs sont requis
      if (descriptionRef.current?.value) {
        formData.append("description", descriptionRef.current.value)
      } else {
        showNotification("La description est requise", "error")
        return
      }
      if (emailRef.current?.value) {
        formData.append("email", emailRef.current.value)
      } else {
        showNotification("L'email est requis", "error")
        return
      }
      if (imageRef.current?.files?.[0]) {
        formData.append("image", imageRef.current.files[0])
      } else {
        showNotification("Une image est requise", "error")
        return
      }
    }

    if (selectedId) {
      updateMutation.mutate({ id: selectedId, data: formData })
      showNotification("Offre mise à jour avec succès", "success")
    } else {
      addMutation.mutate(formData)
      showNotification("Nouvelle offre ajoutée", "success")
    }

    setSelectedId(null)
    setCurrentImage(null)
    setPreviewImage(null)
    e.currentTarget.reset()
  }

  const handleEdit = (item: any) => {
    setSelectedId(item.id)
    setCurrentImage(item.image || null)
    if (descriptionRef.current) descriptionRef.current.value = item.description
    if (emailRef.current) emailRef.current.value = item.email

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleCancel = () => {
    setSelectedId(null)
    setCurrentImage(null)
    setPreviewImage(null)
    if (descriptionRef.current) descriptionRef.current.value = ""
    if (emailRef.current) emailRef.current.value = ""
    if (imageRef.current) imageRef.current.value = ""
  }

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre de recrutement ?")) {
      deleteMutation.mutate(id)
      showNotification("Offre supprimée avec succès", "success")
    }
  }

  // Notification system
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
    visible: boolean
  }>({
    message: "",
    type: "success",
    visible: false,
  })

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      message,
      type,
      visible: true,
    })

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Notification */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-emerald-500" : "bg-rose-500"
            } text-white flex items-center space-x-2`}
          >
            {notification.type === "success" ? (
              <PlusCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <p>{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Gestion des Offres de Recrutement
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden mb-10"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              {selectedId ? (
                <>
                  <Edit className="mr-2 h-5 w-5" />
                  Modifier une offre
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Ajouter une nouvelle offre
                </>
              )}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FileText className="mr-2 h-4 w-4 text-indigo-500" />
                Description de l'offre
              </label>
              <textarea
                ref={descriptionRef}
                placeholder="Décrivez le poste, les qualifications requises..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 min-h-[120px]"
                required={!selectedId}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <Mail className="mr-2 h-4 w-4 text-indigo-500" />
                Email de contact
              </label>
              <input
                ref={emailRef}
                type="email"
                placeholder="email@exemple.com"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required={!selectedId}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <ImageIcon className="mr-2 h-4 w-4 text-indigo-500" />
                Image de l'offre
              </label>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-all duration-200"
                  >
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-700">
                        Cliquez pour sélectionner une image
                      </span>
                    </div>
                    <input
                      id="image-upload"
                      ref={imageRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      required={!selectedId}
                    />
                  </label>
                </div>

                {/* Preview de l'image */}
                <AnimatePresence>
                  {(previewImage || currentImage) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-24 h-24"
                    >
                      <img
                        src={previewImage || currentImage || ""}
                        alt="Aperçu"
                        className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentImage(null)
                          setPreviewImage(null)
                          if (imageRef.current) imageRef.current.value = ""
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium shadow-md transition-all duration-200 ${
                  selectedId
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                }`}
                disabled={addMutation.isLoading || updateMutation.isLoading}
              >
                {addMutation.isLoading || updateMutation.isLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : selectedId ? (
                  <Save className="h-5 w-5 mr-2" />
                ) : (
                  <PlusCircle className="h-5 w-5 mr-2" />
                )}
                {selectedId ? "Enregistrer les modifications" : "Ajouter l'offre"}
              </motion.button>

              {selectedId && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center py-3 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  <X className="h-5 w-5 mr-2" />
                  Annuler
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="mr-2 h-6 w-6 text-indigo-600" />
            Offres de recrutement existantes
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              <span className="ml-3 text-gray-600">Chargement des offres...</span>
            </div>
          ) : data?.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Aucune offre de recrutement pour le moment</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {data?.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center">
                        {item.image && (
                          <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt=""
                              className="h-32 w-full object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-gray-800 text-lg mb-2 whitespace-pre-line">{item.description}</p>
                          <p className="text-indigo-600 flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {item.email}
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4 flex md:flex-col space-x-3 md:space-x-0 md:space-y-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(item)}
                            className="flex items-center justify-center py-2 px-4 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center justify-center py-2 px-4 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default RecrutementAdminPage
