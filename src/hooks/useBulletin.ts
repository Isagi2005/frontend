import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import bulletinApi from "../api/bulletinApi";

export const useGetPeriode = () => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["periode"],
    queryFn: bulletinApi.getPeriode,
  });
}

export const useGenericsPeriode = (name: string, value: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["periode", "filter", name, value],
    queryFn: () => bulletinApi.getGenericsPeriode(name, value),
  });
}

export const UseRetrievePeriode = (id: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["periode", id],
    queryFn: () => bulletinApi.retrievePeriode(id),
  });
}

export const useAddPeriode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["periode"],
    mutationFn: bulletinApi.addPeriode,
    onSuccess: () => {
      queryClient.invalidateQueries(["periode"] );
    },
  });
}

export const useUpdatePeriode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["periode"],
    mutationFn: bulletinApi.updatePeriode,
    onSuccess: () => {
      queryClient.invalidateQueries( ["periode"] );
    },
  });
}

export const useDeletePeriode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["periode"],
    mutationFn: bulletinApi.deletePeriode,
    onSuccess: () => {
      queryClient.invalidateQueries( ["periode"] );
    },
  });
}

export const useGetDomaine = () => {
  return useQuery({
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryKey: ["domaine"],
    queryFn: bulletinApi.getDomaine,
  });
};

export const useGenericsDomaine = (name: string, value: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryKey: ["domaine", "filter", name, value],
    queryFn: () => bulletinApi.getGenericsDomaine(name, value),
  });
};

export const UseRetrieveDomaine = (id: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryKey: ["domaine", id],
    queryFn: () => bulletinApi.retrieveDomaine(id),
    enabled: !!id, // Active la requête uniquement si id est défini
  });
};

export const useAddDomaine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["domaine"],
    mutationFn: bulletinApi.addDomaine,
    onSuccess: () => {
      queryClient.invalidateQueries(["domaine"] );
    },
  });
};

export const useUpdateDomaine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["domaine"],
    mutationFn: bulletinApi.updateDomaine,
    onSuccess: () => {
      queryClient.invalidateQueries( ["domaine"] );
    },
  });
};

export const useDeleteDomaine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["domaine"],
    mutationFn: bulletinApi.deleteDomaine,
    onSuccess: () => {
      queryClient.invalidateQueries( ["domaine"] );
    },
  });
};

export const useGetBulletin = () => {
  return useQuery({
    staleTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 5 * 60 * 1000,
    queryKey: ["bulletin"],
    queryFn: bulletinApi.getBulletin,
  });
};

export const useGenericsBulletin = (name: string, value: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["bulletin", "filter", name, value],
    queryFn: () => bulletinApi.getGenericsBulletin(name, value),
  });
};

export const useDeleteBulletin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["bulletin"],
    mutationFn: bulletinApi.deleteBulletin,
    onSuccess: () => {
      queryClient.invalidateQueries( ["bulletin"] );
    },
  });
};

export const useRetrieveBulletin = (id: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["bulletin", id],
    queryFn: () => bulletinApi.retrieveBulletin(id),
  });
};

export const useGetEvaluation = () => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["evaluation"],
    queryFn: bulletinApi.getEvaluation,
  });
};

export const useGenericsEvaluation = (name: string, value: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["evaluation", "filter", name, value],
    queryFn: () => bulletinApi.getGenericsEvaluation(name, value),
  });
};

export const useRetrieveEvaluation = (id: string) => {
  return useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["evaluation", id],
    queryFn: () => bulletinApi.retrieveEvaluation(id),
  });
};

export const useAddEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["evaluation"],
    mutationFn: bulletinApi.addEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries( ["evaluation"] );
    },
  });
};

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["evaluation"],
    mutationFn: bulletinApi.updateEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries( ["evaluation"] );
    },
  });
};

export const useDeleteEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["evaluation"],
    mutationFn: bulletinApi.deleteEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries( ["evaluation"] );
    },
  });
};

export const useCreateFullBulletin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["bulletin"],
    mutationFn: bulletinApi.createFullBulletin,
    onSuccess: () => {
      queryClient.invalidateQueries( ["bulletin"] );
      queryClient.invalidateQueries(["evaluation"] );
    },
  });
};