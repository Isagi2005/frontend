import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import studentApi from "../api/studentApi";

export const useGetStudent = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentApi.get,
  });
};
export const useGetGenerics = (name: string, value: string) => {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => studentApi.getGenerics(name, value),
  });
};
export const UseRetrieve = (id: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    queryKey: ["student"],
    queryFn: () => studentApi.getOneStudent(id),
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["students"],
    mutationFn: studentApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries( ["students"] );
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["students"],
    mutationFn: studentApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries( ["students"] );
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["students"],
    mutationFn: studentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries( ["students"] );
    },
  });
};
