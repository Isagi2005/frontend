import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import rapportApi, {
  Paiement,
  RapportDetail,
} from "../api/rapportEcolageApi";
import { NotificationParams } from "../api/rapportEcolageApi";

// 🔹 GET : Tous les rapports
export const useGetRapports = () => {
  return useQuery({
    queryKey: ["rapports"],
    queryFn: rapportApi.get,
  });
};

// 🔹 POST : Ajouter un rapport
export const useAddRapport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rapportApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapports"] });
    },
  });
};

// 🔹 GET : Détails d’un rapport (liste d’élèves avec paiements)
export const useGetRapportDetails = (rapportId: number | null) => {
  return useQuery<RapportDetail[]>({
    queryKey: ["rapport-details", rapportId],
    queryFn: () => {
      if (!rapportId) throw new Error("Rapport ID is required");
      return rapportApi.getDetails(rapportId);
    },
    enabled: !!rapportId,
  });
};

// 🔹 DELETE : Supprimer un rapport
export const useDeleteRapport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rapportApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapports"] });
    },
  });
};

// 🔹 DELETE : Supprimer un paiement
export const useDeletePaiement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rapportApi.deletePaiement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapports"] });
    },
  });
};

// 🔹 PUT : Modifier un paiement
export const useUpdatePaiement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Paiement> }) =>
      rapportApi.updatePaiement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapports"] });
    },
  });
};

