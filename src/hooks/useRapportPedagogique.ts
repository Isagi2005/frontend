import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import rapportPedagogiqueApi from "../api/rapportPedagogiqueApi";

export const useGetRapportsDirection = () => {
  return useQuery({
    queryKey: ["rapport-pedagogique-direction"],
    queryFn: rapportPedagogiqueApi.get,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRetrieveRapport = (id: number | undefined) => {
  return useQuery({
    queryKey: ["rapport-pedagogique", id],
    queryFn: () => (id ? rapportPedagogiqueApi.retrieve(id) : Promise.reject()),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddRapport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rapport-pedagogique"],
    mutationFn: rapportPedagogiqueApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapport-pedagogique"] });
    },
  });
};

export const useUpdateRapport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rapport-pedagogique"],
    mutationFn: rapportPedagogiqueApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapport-pedagogique"] });
    },
  });
};

export const useDeleteRapport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rapport-pedagogique"],
    mutationFn: rapportPedagogiqueApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapport-pedagogique"] });
    },
  });
};

export const useMarkRapportAsReadDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lu }: { id: number; lu: boolean }) => rapportPedagogiqueApi.markAsRead(id, lu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rapport-pedagogique"] });
    },
  });
};

export const useGetRapportsGenerics = (params: Record<string, string | number>) => {
  return useQuery({
    queryKey: ["rapport-pedagogique", params],
    queryFn: () => rapportPedagogiqueApi.getGenerics(params),
    staleTime: 5 * 60 * 1000,
  });
};
