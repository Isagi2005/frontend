import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import eventApi from "../api/eventApi";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: eventApi.getEventPublic,
  });
};

export const GetEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: eventApi.getEvents,
  });
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventApi.addEvents,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventApi.updateEvents,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventApi.deleteEvents,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });
};
