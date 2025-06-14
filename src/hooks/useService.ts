import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../api/serviceApi"

export const useGetServices = () =>
  useQuery({
    queryKey: ["services"],
    queryFn: () => getServices().then(res => res.data),
  })

export const useCreateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => createService(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: FormData
    }) => updateService(id, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export const useDeleteService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}
