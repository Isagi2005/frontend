import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import employeApi, { Employe } from "../api/employeApi";

// Récupérer tous les employés
export const useGetEmployes = () => {
  return useQuery({
    queryKey: ["employes"],
    queryFn: employeApi.get,
  });
};

// Ajouter un employé
export const useAddEmploye = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries(["employes"]);
    },
  });
};

// Modifier un employé
export const useUpdateEmploye = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["employes"]);
    },
  });
};

// Supprimer un employé
export const useDeleteEmploye = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["employes"]);
    },
  });
};
