import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListApi } from "./api";
import { useSuspenseUser } from "../auth/use-user";

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const user = useSuspenseUser();

  const deleteTodoMutation = useMutation({
    mutationFn: todoListApi.deleteTodo,
    async onSettled() {
      queryClient.invalidateQueries({
        queryKey: [todoListApi.baseKey],
      });
    },
    async onSuccess(_, deletedId) {
      queryClient.setQueryData(
        todoListApi.getTodoListQueryOptions({ userId: user.data.id }).queryKey,
        (todos) => todos?.filter((item) => item.id !== deletedId),
      );
    },
  });

  return {
    handleDelete: deleteTodoMutation.mutate,
    getIsPending: (id: string) =>
      deleteTodoMutation.isPending && deleteTodoMutation.variables === id,
  };
}
