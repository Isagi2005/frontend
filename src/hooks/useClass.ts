import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classApi from "../api/classApi";


export const useGetClass = () => {
  return useQuery({
    queryKey: ["classe"],
    queryFn: classApi.get,
    staleTime: 5 * 60 * 1000,
  });
};
export const useGetLastClass = () => {
  return useQuery({
    queryKey: ["lastClass"],
    queryFn: classApi.getLastClass,
    staleTime: 5 * 60 * 1000,
  });
};


export const useGetByClass = (name: string, classe: string) => {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => classApi.getTypeByClass(name, classe),
    staleTime: 5 * 60 * 1000,
  });
};

export const UseRetrieve = (id: string) => {
  return useQuery({
    queryKey: ["student"],
    queryFn: () => classApi.retrieve(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["classe"],
    mutationFn: classApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries( {queryKey:["classe"]} );
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["classe"],
    mutationFn: classApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries( {queryKey:["classe"]} );
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["classe"],
    mutationFn: classApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries( {queryKey:["classe"]} );
    },
  });
};
