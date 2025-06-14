// src/hooks/usePaie.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import paieApi, { Paie, PaieParams } from "../api/paieApi";

export const useCreatePaie = () => {
  return useMutation({
    mutationFn: (paie: PaieParams) => paieApi.create(paie),
    onSuccess: () => {
      // Optionnel : invalidation ou message de succès
    },
  });
};

export const useGetPaiesByEmploye = (employeId: number) => {
  return useQuery<Paie[]>({
    queryKey: ["paies", employeId],
    queryFn: () => paieApi.getByEmploye(employeId),
    enabled: !!employeId,
  });
};

export const useUpdatePaie = () => {
  return useMutation({
    mutationFn: ({ id, paie }: { id: number; paie: Partial<PaieParams> }) =>
      paieApi.update(id, paie),
  });
};

export const useDeletePaie = () => {
  return useMutation({
    mutationFn: (id: number) => paieApi.delete(id),
  });
};


