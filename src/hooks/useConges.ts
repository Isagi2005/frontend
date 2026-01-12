import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import congeApi, { Conge } from "../api/congeApi";
import { Employe } from "../api/employeApi";

// Tous les congés
export const useGetConges = () => {
  return useQuery({
    queryKey: ["conges"],
    queryFn: congeApi.get,
  });
};

// Congés par employé
export const useGetCongesByEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: ["conges", employeeId],
    queryFn: () => congeApi.getByEmployee(employeeId),
    enabled: !!employeeId,
  });
};

// Un seul congé
export const useGetOneConge = (id: number) => {
  return useQuery({
    queryKey: ["conge", id],
    queryFn: () => congeApi.getOne(id),
    enabled: !!id,
  });
};

// Ajouter un congé
export const useAddConge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["conges"],
    mutationFn: congeApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conges"] });
    },
  });
};

// Modifier un congé
export const useUpdateConge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["conges"],
    mutationFn: congeApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conges"] });
    },
  });
};

// Supprimer un congé
export const useDeleteConge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["conges"],
    mutationFn: congeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conges"] });
    },
  });
};
export const useGetEmployees = () => {
  return useQuery<Employe[]>({
    queryKey: ['employees'],
    queryFn: congeApi.getEmployees,
  });
};

export const useCreateCongeForEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      employeeId,
      congeData,
    }: {
      employeeId: number;
      congeData: Omit<Conge, 'id' | 'employe'>;
    }) => congeApi.createForEmployee(employeeId, congeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conges"] });
    },
  });
};
export const useGetConge = () => {
  return useQuery({
    queryKey: ['conges'],
    queryFn: congeApi.get
  });
};

