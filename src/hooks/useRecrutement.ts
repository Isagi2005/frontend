// src/hooks/useRecrutement.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import recrutementApi from "../api/recrutementApi"

export const useGetRecrutement = () => {
  return useQuery({
    queryKey: ["recrutement"],
    queryFn: recrutementApi.getAll,
  })
}

export const useGetOneRecrutement = (id: number) => {
  return useQuery({
    queryKey: ["recrutement", id],
    queryFn: () => recrutementApi.getOne(id),
    enabled: !!id,
  })
}

export const useAddRecrutement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["recrutement"],
    mutationFn: recrutementApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recrutement"] })
    },
  })
}

export const useUpdateRecrutement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["recrutement"],
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      recrutementApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recrutement"] })
    },
  })
}

export const useDeleteRecrutement = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["recrutement"],
    mutationFn: recrutementApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recrutement"] })
    },
  })
}
