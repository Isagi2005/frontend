import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import studentApi from "../api/studentApi";

export const useGetStudent = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentApi.get,
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
};
