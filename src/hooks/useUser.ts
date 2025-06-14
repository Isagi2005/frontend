import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApi from "../api/userApi";

export const UseGetUsers = () => {
  return useQuery({
    queryKey: ["userGet"],
    queryFn: userApi.getUsers,
  });
};
export const GetUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getAuthentifiedUser,
  });
};
export const useGetGenerics = (name: string, value: string) => {
  return useQuery({
    queryKey: ["user", value],
    queryFn: () => userApi.getGenerics(name, value),
  });
};

export const UseRetrieve = (id: string) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => userApi.retrieve(id),
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["usersAdd"],
    mutationFn: userApi.addUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["usersAdd"]);
    },
  });
};
export const useAddProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["profileAdd"],
    mutationFn: userApi.addProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profileAdd"]);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["userUpdateuserUpdate"],
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["userUpdate"]);
    },
  });
};
export const UseUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["profile"],
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["userDelete"],
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["userDelete"]);
    },
  });
};
