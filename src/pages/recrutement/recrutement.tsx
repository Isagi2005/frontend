import { useState } from "react"
import { useGetRecrutement } from "../../hooks/useRecrutement"
import { Button, Card, CardContent, CardMedia, Typography, Box, SxProps } from "@mui/material"
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import EmailIcon from '@mui/icons-material/Email'

interface RecrutementData {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  image: string;
  email: string;
  // Ajoutez d'autres champs selon votre modèle de données
}

const cardStyle: SxProps = {
  maxWidth: 345,
  m: 2,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)'
  }
};

const Recrutement = () => {
  const { data, isLoading } = useGetRecrutement() as { 
    data: RecrutementData[] | undefined; 
    isLoading: boolean; 
    error?: Error 
  }
  const [expandedIds, setExpandedIds] = useState<number[]>([])

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500 mb-4"></span>
      <p className="text-lg text-gray-600">Chargement des offres...</p>
    </div>
  )

  const recrutementData = data || [];

  if (recrutementData.length === 0) {
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

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Offres d'emploi
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Découvrez nos opportunités de carrière et rejoignez notre équipe
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {recrutementData.map((item: RecrutementData) => (
            <Card key={item.id} sx={cardStyle}>
              {item.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.title || 'Offre de recrutement'}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.title || 'Titre non spécifié'}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: expandedIds.includes(item.id) ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2
                  }}
                >
                  {expandedIds.includes(item.id) 
                    ? item.description || 'Aucune description fournie'
                    : truncateText(item.description || '', 150)}
                </Typography>

                {item.requirements && item.requirements.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Compétences requises :
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, m: 0, '& li': { mb: 0.5 } }}>
                      {item.requirements.map((req: string, idx: number) => (
                        <Typography key={idx} component="li" variant="body2" color="text.secondary">
                          {req}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mt: 'auto',
                  pt: 2
                }}>
                  <Button 
                    size="small" 
                    onClick={() => toggleExpanded(item.id)}
                    sx={{ textTransform: 'none' }}
                  >
                    {expandedIds.includes(item.id) ? 'Voir moins' : 'En savoir plus'}
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<EmailIcon />}
                    href={`mailto:${item.email || 'contact@exemple.com'}`}
                    sx={{ textTransform: 'none' }}
                  >
                    Postuler
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Recrutement
