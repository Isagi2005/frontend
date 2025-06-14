import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import presenceApi from "../api/presenceApi";

export const useAddCours = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cours"],
    mutationFn: presenceApi.addCours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cours"] });
    },
  });
};
export const useAddPresEtudiant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["presenceKey"],
    mutationFn: presenceApi.addPresEtudiant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presenceKey"] });
    },
  });
};

export const useAddPresPersonnel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["presence"],
    mutationFn: presenceApi.addPresPers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["presence"] });
    },
  });
};

export const useGetCours = () => {
  return useQuery({
    queryKey: ["getCours"],
    queryFn: presenceApi.getCours,
  });
};
export const useGetPresEtudiant = () => {
  return useQuery({
    queryKey: ["getPres"],
    queryFn: presenceApi.getPresenceEtudiant,
  });
};

export const useGetPresPersonnel = () => {
  return useQuery({
    queryKey: ["getPerso"],
    queryFn: presenceApi.getPresencePers,
  });
};
export const useRetrieve = (id: string, endpoints: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    queryKey: [`${endpoints}`],
    queryFn: () => presenceApi.retrieve(endpoints, id),
  });
};

export const useGetGenerics = (name: string, value: string) => {
  return useQuery({
    queryKey: [`${name}`],
    queryFn: () => presenceApi.getGenerics(name, value),
  });
};

export const useVerification = (cours_id: string) => {
  return useQuery({
    queryKey: ["checking", cours_id],
    queryFn: () => presenceApi.verification(cours_id),
  });
};

export const useUpdateCours = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["coursUpdate"],
    mutationFn: presenceApi.updateCours,
    onSuccess: () => {
      queryClient.invalidateQueries(["coursUpdate"] );
    },
  });
};

export const useUpdatePres = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["presence"],
    mutationFn: presenceApi.updatePresEtudiant,
    onSuccess: () => {
      queryClient.invalidateQueries(["presence"] );
    },
  });
};


export const useDeleteCours = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["coursDelete"],
    mutationFn: presenceApi.deleteCours,
    onSuccess: () => {
      queryClient.invalidateQueries(["coursDelete"]);
    },
  });
};

export const useDeleteInscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["inscription"],
    mutationFn: presenceApi.deleteInscription,
    onSuccess: () => {
      queryClient.invalidateQueries( ["inscription"] );
    },
  });
};
