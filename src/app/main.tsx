import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app.tsx";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { queryClient } from "../shared/api/query-client";
import { store } from "../shared/redux";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { onlineManager } from "@tanstack/query-core";
import { Loader } from "./loader";

onlineManager.setOnline(navigator.onLine);

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <Provider store={store}>
        <Loader>
          <App />
        </Loader>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </PersistQueryClientProvider>
  </StrictMode>,
);
