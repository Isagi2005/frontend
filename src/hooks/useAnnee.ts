import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import anneeApi from "../api/anneeApi";

export const useGet = () => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["annee"],
    queryFn: anneeApi.get,
  });
};

export const useGetGenerics = (name: string, value: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["annee"],
    queryFn: () => anneeApi.getGenerics(name, value),
  });
};
export const UseRetrieve = (id: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["annee"],
    queryFn: () => anneeApi.retrieve(id),
  });
};

export const useAdd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["annee"],
    mutationFn: anneeApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annee"] });
    },
  });
};

export const useUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["annee"],
    mutationFn: anneeApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annee"] });
    },
  });
};

export const useDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["annee"],
    mutationFn: anneeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annee"] });
    },
  });
};
