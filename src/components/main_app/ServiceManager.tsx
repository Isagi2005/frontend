import React, { useState } from "react"
import { useCreateService, useDeleteService, useGetServices, useUpdateService } from "../../hooks/useService"

interface ServiceFormData {
  service_type: string
  title: string
  description: string
  image: File | null
}

const initialFormData: ServiceFormData = {
  service_type: "",
  title: "",
  description: "",
  image: null,
}

const ServiceManager: React.FC = () => {
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData)
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)

  const { data: services, isLoading } = useGetServices()
  const createService = useCreateService()
  const updateService = useUpdateService()
  const deleteService = useDeleteService()

  // Gérer le changement de champ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Gérer le fichier image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, image: file }))
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData(initialFormData)
    setEditingServiceId(null)
  }

  // Soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    data.append("service_type", formData.service_type)
    data.append("title", formData.title)
    data.append("description", formData.description)
    if (formData.image) {
      data.append("image", formData.image)
    }

    if (editingServiceId) {
      updateService.mutate({ id: editingServiceId, data })
    } else {
      createService.mutate(data)
    }

    resetForm()
  }

  // Interface pour le type Service
  interface Service {
    id: number;
    service_type: string;
    title: string;
    description: string;
    image: string;
  }

  // Préparer l’édition
  const handleEdit = (service: Service) => {
    setFormData({
      service_type: service.service_type,
      title: service.title,
      description: service.description,
      image: null,
    })
    setEditingServiceId(service.id)
  }

  // Gérer la suppression
  const handleDelete = (id: number) => {
    if (window.confirm("Supprimer ce service ?")) {
      deleteService.mutate(id)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">
        {editingServiceId ? "Modifier un service" : "Ajouter un service"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="service_type"
          value={formData.service_type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Choisir le type de service --</option>
          <option value="Buffet">Buffet</option>
          <option value="Transport">Transport</option>
        </select>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titre du service"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {editingServiceId ? "Modifier" : "Ajouter"}
          </button>
          {editingServiceId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <hr className="my-8" />

      <h2 className="text-xl font-semibold mb-4">Liste des services</h2>

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services?.map(service => (
            <div
              key={service.id}
              className="border rounded p-4 flex flex-col gap-2 shadow-sm"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-lg font-bold">{service.title}</h3>
              <p className="text-sm text-gray-500 italic">{service.service_type}</p>
              <p className="text-sm">{service.description}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ServiceManager
