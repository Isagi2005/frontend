import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import employeApi from "../api/employeApi";

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
      queryClient.invalidateQueries({ queryKey: ["employes"] }) 
    },
  });
};

// Modifier un employé
export const useUpdateEmploye = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["employes"]});
    },
  });
};

// Supprimer un employé
export const useDeleteEmploye = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employes"] })
    },
  });
};
