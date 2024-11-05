import { queryClient } from "../../shared/api/query-client";
import { AppThunk } from "../../shared/redux";
import { MutationObserver, useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import { authSlice } from "./auth.slice";

export const loginThunk =
  (login: string, password: string): AppThunk =>
  async (dispatch) => {
    const user = await new MutationObserver(queryClient, {
      mutationKey: ["login"],
      mutationFn: authApi.loginUser,
    }).mutate({
      login,
      password,
    });

    if (!login || !password) {
      dispatch(authSlice.actions.setError("Введите логин и пароль"));
    } else {
      if (user) {
        dispatch(
          authSlice.actions.addUser({
            userId: user.id,
          }),
        );

        queryClient.setQueryData(authApi.getUserById(user.id).queryKey, user);
        localStorage.setItem("userId", user.id);
      }

      dispatch(authSlice.actions.setError("Логин или пароль неверные"));
    }
  };

export const useLoginLoading = () =>
  useMutation({
    mutationKey: ["login"],
  }).isPending;
