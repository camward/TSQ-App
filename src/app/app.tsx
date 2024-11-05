import { Login } from "../modules/auth/login";
import { LogoutButton } from "../modules/auth/logout-button";
import { useUser } from "../modules/auth/use-user";
import { TodoList } from "../modules/todo-list/todo-list";
import { prefetchTodoList } from "../modules/todo-list/prefetch-todo-list";

export function App() {
  const user = useUser();

  if (user.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (user.data) {
    prefetchTodoList();

    return (
      <div className="p-5 mx-auto max-w-[1200px] mt-5 mb-5">
        <LogoutButton />
        <TodoList />
      </div>
    );
  }

  return <Login />;
}
