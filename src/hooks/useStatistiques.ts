import { useQuery } from '@tanstack/react-query';
import statApi from '../api/statApi';

export function useClasseStats(classeId: number, periodeId?: number) {
  return useQuery({
    queryKey: ['classeStats', classeId, periodeId],
    queryFn: () => statApi.getClasseStats(classeId, periodeId),
    enabled: !!classeId,
  });
}
export function usePresenceStatsEleve(eleveId: number) {
  return useQuery({
    queryKey: ['presenceStatsEleve', eleveId],
    queryFn: () => statApi.getPresenceStatsEleve(eleveId),
    enabled: !!eleveId,
  });
}

export function useEvolutionEleve(eleveId: number) {
  return useQuery({
    queryKey: ['evolutionEleve', eleveId],
    queryFn: () => statApi.getEvolutionEleve(eleveId),
    enabled: !!eleveId,
  });
}

export function useAlertesDifficulte() {
  return useQuery({
    queryKey: ['alertesDifficulte'],
    queryFn: statApi.getAlertesDifficulte,
  });
}