import { useQuery } from "@tanstack/react-query";
import dashApi from "../api/dashboardApi";

import type { DashboardData, TypePerformanceEleve } from "../api/dashboardApi";

import type { DashboardFilters, ParentEnfantPedagogique } from "../api/dashboardApi";

export const useGetDashEnseignant = (params?: {
  classe_id?: number;
  annee_id?: number;
  trimestre_id?: number;
}) => {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboardEnseignant", params],
    queryFn: () => dashApi.getDashboardEnseignant(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetDashDirection = (params?: {
  classe_id?: number;
  annee_id?: number;
  trimestre_id?: number;
}) => {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboardEnseignant", params],
    queryFn: () => dashApi.getDashboardDirection(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetPerformanceEleve = (
  eleveId: number | undefined,
  trimestre_id?: number | string
) => {
  return useQuery<TypePerformanceEleve, Error>({
    queryKey: ["performanceEleve", eleveId, trimestre_id],
    queryFn: () => {
      if (!eleveId) throw new Error("Pas d'ID élève");
      return dashApi.getPerformanceEleve(eleveId, trimestre_id ? { trimestre_id } : undefined);
    },
    enabled: !!eleveId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetParentPedagogique = () => {
  return useQuery<ParentEnfantPedagogique[], Error>({
    queryKey: ["parentPedagogique"],
    queryFn: dashApi.getParentPedagogique,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetDashFilters = () => {
  return useQuery<DashboardFilters, Error>({
    queryKey: ["dashboardFilters"],
    queryFn: dashApi.getDashboardFilters,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
export const useGetDirFilters = () => {
  return useQuery<DashboardFilters, Error>({
    queryKey: ["dashboardFilters"],
    queryFn: dashApi.getDirFilters,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};