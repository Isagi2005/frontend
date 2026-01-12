import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../api/serviceApi"

import type { Service as ApiService } from "../api/serviceApi";

export type Service = ApiService;

export const useGetServices = () =>
  useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: getServices
  })

export const useCreateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: FormData): Promise<Service> => {
      const response = await createService(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await updateService(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

// In useService.ts
export const useDeleteService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteService(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  })
}
