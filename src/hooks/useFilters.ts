import { useQuery } from "@tanstack/react-query";
import filtersApi, { FilterParams } from "../api/filtersApi";

// Hook pour récupérer les paiements en fonction des filtres
export const useGetFilteredPaiements = (filters: FilterParams) => {
  return useQuery({
    queryKey: ["paiements", filters],
    queryFn: async () => {
      if (filters.etudiant && filters.mois) {
        return filtersApi.getPaiementsByStudentAndMonth(Number(filters.etudiant), filters.mois);
      } else if (filters.anneeScolaire && filters.mois) {
        // Récupérer les paiements pour un mois et une année scolaire spécifiques
        return filtersApi.getPaiementsByMois(filters.anneeScolaire, filters.mois);
      } else if (filters.classe && filters.anneeScolaire) {
        // Récupérer les paiements pour une classe et une année scolaire spécifiques
        return filtersApi.getStudentsByClasseAndAnnee(filters.classe, filters.anneeScolaire);
      }
      return []; // Si aucun filtre n'est appliqué, retourne un tableau vide
    },
    enabled: !!filters, // Ne fait la requête que si des filtres sont fournis
  });
};
