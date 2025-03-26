import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classApi from "../api/classApi";

export const useGetClass = () => {
  return useQuery({
    queryKey: ["classe"],
    queryFn: classApi.get,
  });
};

export const useAddClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries(["classe"]);
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["classe"]);
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["classe"]);
    },
  });
};
