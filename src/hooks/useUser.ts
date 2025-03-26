import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApi from "../api/userApi";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });
};
export const GetUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getAuthentifiedUser,
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
