import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import eventApi from "../api/eventApi";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: eventApi.getEventPublic,
    staleTime: 5 * 60 * 1000,
  });
};


export const GetOneEvent = (id: number) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventApi.getOneEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};


export const GetEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: eventApi.getEvents,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["eventAdd"],
    mutationFn: eventApi.addEvents,
    onSuccess: () => {
      queryClient.invalidateQueries( ["eventAdd"] );
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["eventUpdate"],
    mutationFn: eventApi.updateEvents,
    onSuccess: () => {
      queryClient.invalidateQueries( ["eventUpdate"] );
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["eventDelete"],
    mutationFn: eventApi.deleteEvents,
    onSuccess: () => {
      queryClient.invalidateQueries(["eventDelete"] );
    },
  });
};
