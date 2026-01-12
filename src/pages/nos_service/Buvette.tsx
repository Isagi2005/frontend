import type React from "react"
import { useState, useEffect } from "react"
import { useGetServices } from "../../hooks/useService"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Box, Tabs, Tab, Card, CardContent, CardMedia, Typography, Button, Avatar } from "@mui/material"
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import RestaurantIcon from '@mui/icons-material/Restaurant'

const Buvette: React.FC = () => {
  const { data: services, isLoading } = useGetServices()
  const [activeTab, setActiveTab] = useState<string | null>(null)

  // Regrouper les services par type
  const servicesByType = services?.reduce<Record<string, Service[]>>((acc: Record<string, Service[]>, service: Service) => {
    const type = service.service_type
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(service)
    return acc
  }, {})

  // Définir automatiquement le premier onglet comme actif au chargement
  useEffect(() => {
    if (servicesByType && Object.keys(servicesByType).length > 0 && activeTab === null) {
      setActiveTab(Object.keys(servicesByType)[0])
    }
  }, [servicesByType, activeTab])

  // Définir les icônes par type de service (pour MUI)
  const getIconForTypeMui = (type: string) => {
    switch (type) {
      case "Buffet": return <RestaurantIcon sx={{ fontSize: 28, color: 'primary.main' }} />
      case "Transport": return <DirectionsBusIcon sx={{ fontSize: 28, color: 'primary.main' }} />
      default: return <LocalCafeIcon sx={{ fontSize: 28, color: 'primary.main' }} />
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400, justifyContent: 'center' }}>
        <span className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></span>
        <Typography variant="h6" color="text.secondary">Chargement des services...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 }, px: { xs: 2, md: 6 }, minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header illustré */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mb: 2 }}>
            <LocalCafeIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Typography variant="h3" component="h1" align="center" fontWeight={700} color="text.primary" gutterBottom>
            Nos Services
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" maxWidth={600}>
            Découvrez l'ensemble des services que nous mettons à votre disposition
          </Typography>
        </Box>

        {/* Navigation par onglets moderne */}
        {servicesByType && Object.keys(servicesByType).length > 0 && (
          <Tabs
            value={activeTab || Object.keys(servicesByType)[0]}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 6, borderRadius: 2, bgcolor: 'background.default', boxShadow: 1 }}
            aria-label="Types de services"
          >
            {Object.keys(servicesByType).map((type) => (
              <Tab
                key={type}
                value={type}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getIconForTypeMui(type)}
                    <span style={{ marginLeft: 8, fontWeight: 500 }}>{type}</span>
                  </Box>
                }
                sx={{
                  textTransform: 'none',
                  fontSize: 18,
                  fontWeight: 600,
                  minHeight: 48,
                  px: 3,
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                }}
              />
            ))}
          </Tabs>
        )}

        {/* Contenu des services modernisé */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {activeTab && servicesByType && servicesByType[activeTab] ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, width: '100%', maxWidth: 1100 }}>
              {servicesByType[activeTab]?.map((service: Service, index: number) => (
                <ServiceCardMui
                  key={service.id || index}
                  service={service}
                  icon={getIconForTypeMui(service.service_type)}
                  index={index}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 10, width: '100%' }}>
              <Typography variant="h6" color="text.secondary">
                {servicesByType && Object.keys(servicesByType).length === 0
                  ? "Aucun service n'est disponible pour le moment."
                  : "Sélectionnez une catégorie pour voir les services disponibles"}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}


interface Service {
  id: number;
  service_type: string;
  title: string;
  description: string;
  price?: number;
  image?: string;
  updated_at: string;
}

interface ServiceCardMuiProps {
  service: Service;
  icon: React.ReactNode;
  index: number;
}

const ServiceCardMui: React.FC<ServiceCardMuiProps> = ({ service, icon }) => {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const shortDescription = service.description?.length > 200 
    ? `${service.description.substring(0, 200)}...` 
    : service.description

  return (
    <Card elevation={5} sx={{ borderRadius: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width:750, height:"auto" ,minHeight: 260, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 10 } }}>
      {/* Image du service ou icône */}
      {service.image ? (
        <CardMedia
          component="img"
          image={service.image}
          alt={service.title}
          sx={{ width: { xs: '100%', md: 220 }, height: { xs: 180, md: '100%' }, objectFit: 'cover', borderTopLeftRadius: 16, borderBottomLeftRadius: { md: 16, xs: 0 } }}
        />
      ) : (
        <Box sx={{ width: { xs: '100%', md: 220 }, height: { xs: 180, md: '100%' }, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
      )}
      {/* Contenu */}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 180 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="subtitle1" color="primary.main" fontWeight={600} sx={{ ml: 1 }}>{service.service_type}</Typography>
        </Box>
        <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
          {service.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {showFullDescription ? service.description : shortDescription}
        </Typography>
        {service.description?.length > 200 && (
          <Button
            onClick={() => setShowFullDescription(!showFullDescription)}
            size="small"
            sx={{ color: 'primary.main', textTransform: 'none', alignSelf: 'flex-start', mb: 1 }}
            endIcon={showFullDescription ? <ChevronUp /> : <ChevronDown />}
          >
            {showFullDescription ? 'Voir moins' : 'Voir plus'}
          </Button>
        )}
        {service.price && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="h6" color="text.primary" fontWeight={700}>{service.price}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default Buvette