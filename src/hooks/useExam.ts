import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import examApi from "../api/examApi";

export const useGetExam = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: examApi.get,
  });
};

export const useAddExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries(["exams"]);
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["exams"]);
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["exams"]);
    },
  });
};
