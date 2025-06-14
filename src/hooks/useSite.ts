import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import contenuApi from "../api/siteApi";

export const useAddPresentation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["presentation"],
    mutationFn: contenuApi.addPresentation,
    onSuccess: () => {
      queryClient.invalidateQueries(["presentation"]);
    },
  });
};
export const useAddInscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["demande"],
    mutationFn: contenuApi.addInscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["demande"]);
    },
  });
};

export const useGetPresentation = () => {
  return useQuery({
    queryKey: ["presentation"],
    queryFn: contenuApi.getPresentation,
  });
};
export const useGetAccueil = () => {
  return useQuery({
    queryKey: ["accueil"],
    queryFn: contenuApi.getAccueilData,
  });
};

export const useGetFooter = () => {
  return useQuery({
    queryKey: ["footer"],
    queryFn: contenuApi.getFooterData,
  });
};
export const useRetrieve = (id: string, endpoints: string) => {
  return useQuery({
    queryKey: [`${endpoints}`],
    queryFn: () => contenuApi.retrieve(id, endpoints),
  });
};

export const useGetInscription = () => {
  return useQuery({
    queryKey: ["demande"],
    queryFn: contenuApi.getInscriptionData,
  });
};

export const useUpdateAccueil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["accueil"],
    mutationFn: contenuApi.updateAccueil,
    onSuccess: () => {
      queryClient.invalidateQueries(["accueil"]);
    },
  });
};

export const useUpdateFooter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["footer"],
    mutationFn: contenuApi.updateFooter,
    onSuccess: () => {
      queryClient.invalidateQueries(["footer"]);
    },
  });
};

export const useUpdatePresentation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["presentation"],
    mutationFn: contenuApi.updatePresentation,
    onSuccess: () => {
      queryClient.invalidateQueries(["presentation"]);
    },
  });
};
export const useUpdateStatut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["statut"],
    mutationFn: contenuApi.updateStatut,
    onSuccess: () => {
      queryClient.invalidateQueries(["statut"]);
    },
  });
};

export const useDeletePresentation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["presentation"],
    mutationFn: contenuApi.deletePresentation,
    onSuccess: () => {
      queryClient.invalidateQueries(["presentation"]);
    },
  });
};

export const useDeleteInscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["inscription"],
    mutationFn: contenuApi.deleteInscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["inscription"]);
    },
  });
};
