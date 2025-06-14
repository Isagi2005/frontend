import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import subjectApi from "../api/subjectApi";

export const useGetSubject = () => {
  return useQuery({
    queryKey: ["subject"],
    queryFn: subjectApi.get,
  });
};

export const useGetGenerics = (name: string, value: string) => {
  return useQuery({
    queryKey: ["subject"],
    queryFn: () => subjectApi.getGenerics(name, value),
  });
};
export const UseRetrieve = (id: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    queryKey: ["student"],
    queryFn: () => subjectApi.retrieve(id),
  });
};

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["subject"],
    mutationFn: subjectApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject"] });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["subject"],
    mutationFn: subjectApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject"] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["subject"],
    mutationFn: subjectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject"] });
    },
  });
};
