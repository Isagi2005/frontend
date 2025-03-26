import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import subjectApi from "../api/subjectApi";

export const useGetSubject = () => {
  return useQuery({
    queryKey: ["subject"],
    queryFn: subjectApi.get,
  });
};

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries(["subject"]);
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["subject"]);
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["subject"]);
    },
  });
};
