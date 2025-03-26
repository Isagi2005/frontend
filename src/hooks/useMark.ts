import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import markApi from "../api/markApi";

export const useGetMark = () => {
  return useQuery({
    queryKey: ["marks"],
    queryFn: markApi.get,
  });
};

export const useAddMark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries(["marks"]);
    },
  });
};

export const useUpdateMark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["marks"]);
    },
  });
};

export const useDeleteMark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["marks"]);
    },
  });
};
