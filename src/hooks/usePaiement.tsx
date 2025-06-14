import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import paiementApi, { Paiement} from "../api/paiementApi";

interface HistoriqueParams {
  classeId: number;
  annee: string;
  mois: string;
}

// Récupérer l'historique des paiements
export const usePaiementHistorique = (classeId: number, annee: string, mois: string) => {
  return useQuery({
    queryKey: ["paiementHistorique", classeId, annee, mois],
    queryFn: () => paiementApi.getPaiementHistorique(classeId, annee, mois),
    enabled: !!classeId && !!annee && !!mois,
  });
};

// Récupérer tous les paiements
export const useGetPaiements = () => {
  return useQuery({
    queryKey: ["paiements"],
    queryFn: paiementApi.get,
  });
};

// Récupérer les paiements d'un étudiant
export const useGetPaiementsByStudent = (etudiantId: number) => {
  return useQuery({
    queryKey: ["paiements", etudiantId],
    queryFn: () => paiementApi.getByStudent(etudiantId),
    enabled: !!etudiantId,
  });
};

// Récupérer un paiement spécifique
export const useRetrievePaiement = (id: number) => {
  return useQuery({
    queryKey: ["paiement", id],
    queryFn: () => paiementApi.getOne(id),
    enabled: !!id,
  });
};

// Ajouter un paiement
export const useAddPaiement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["paiements"],
    mutationFn: paiementApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries(["paiements"]);
    },
  });
};

// Mettre à jour complètement un paiement (PUT)
export const useUpdatePaiement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["paiements"],
    mutationFn: (paiement: Paiement) => {
      if (!paiement.id) throw new Error("Le paiement doit avoir un ID.");
      return paiementApi.update(paiement);
    },
    onSuccess: (_data, paiement) => {
      queryClient.invalidateQueries(["paiements"]);
      if (paiement.etudiant) {
        queryClient.invalidateQueries(["paiements", paiement.etudiant]);
      }
    },
  });
};

// Modifier partiellement un paiement (PATCH)
export const usePatchPaiement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["paiements"],
    mutationFn: (paiement: Partial<Paiement> & { id: number }) => {
      return paiementApi.patch(paiement);
    },
    onSuccess: (_data, paiement) => {
      queryClient.invalidateQueries(["paiements"]);
      if (paiement.etudiant) {
        queryClient.invalidateQueries(["paiements", paiement.etudiant]);
      }
    },
  });
};

// Supprimer un paiement
export const useDeletePaiement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["paiements"],
    mutationFn: paiementApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["paiements"]);
    },
  });
};

// Envoyer rapport de paiements
export const useEnvoyerRapport = () => {
  return useMutation({
    mutationKey: ["envoyerRapport"],
    mutationFn: ({
      classeId,
      annee,
      mois,
    }: {
      classeId: number;
      annee: string;
      mois: string;
    }) => paiementApi.envoyerRapport(classeId, annee, mois),
  });
};
// Ajouter plusieurs paiements
export const useAddPaiementsMultiples = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["paiements-multiples"],
    mutationFn: paiementApi.addMultiple,
    onSuccess: () => {
      queryClient.invalidateQueries(["paiements"]);
    },
  });
};

