import { useState } from "react"
import { useGetRecrutement } from "../../hooks/useRecrutement"
import { Button, Card, CardContent, CardMedia, Typography, Box, Avatar } from "@mui/material"
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import EmailIcon from '@mui/icons-material/Email'

const Recrutement = () => {
  const { data, isLoading } = useGetRecrutement()
  const [expandedIds, setExpandedIds] = useState<number[]>([])

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500 mb-4"></span>
      <p className="text-lg text-gray-600">Chargement des offres...</p>
    </div>
  )

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <WorkOutlineIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Aucune offre de recrutement pour le moment.</Typography>
      </div>
    )
  }

  const toggleExpanded = (id: number) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 }, px: { xs: 2, md: 6 }, mt: { xs: 8, md: 12 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header illustré */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mb: 2 }}>
            <WorkOutlineIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Typography variant="h3" component="h1" align="center" fontWeight={700} color="text.primary" gutterBottom>
            Opportunités de Recrutement
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" maxWidth={600}>
            Découvrez nos offres d'emploi et rejoignez une équipe dynamique et engagée !
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 5 }}>
          {data.map((recrute: any) => {
            const isExpanded = expandedIds.includes(recrute.id)
            const shouldTruncate = recrute.description.length > 200

            return (
              <Card key={recrute.id} elevation={4} sx={{ borderRadius: 4, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={recrute.image}
                  alt="Recrutement"
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 180 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {isExpanded || !shouldTruncate
                      ? recrute.description
                      : truncateText(recrute.description, 200)}
                  </Typography>
                  {shouldTruncate && (
                    <Button
                      onClick={() => toggleExpanded(recrute.id)}
                      size="small"
                      sx={{ color: 'primary.main', textTransform: 'none', alignSelf: 'flex-start', mb: 1 }}
                    >
                      {isExpanded ? 'Voir moins' : 'Voir plus'}
                    </Button>
                  )}
                  <Button
                    href={`mailto:${recrute.email}`}
                    startIcon={<EmailIcon />}
                    variant="outlined"
                    sx={{ mt: 'auto', fontWeight: 600, borderRadius: 2 }}
                  >
                    {recrute.email}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}


export default Recrutement
