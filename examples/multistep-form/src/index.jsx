import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import MultiStepFormApplication from "./App";
import { Application, IndexedDBMethod } from "@nmfs-radfish/radfish";
import { ErrorBoundary } from "@nmfs-radfish/react-radfish";

const app = new Application({
  storage: new IndexedDBMethod(
    import.meta.env.VITE_INDEXED_DB_NAME,
    import.meta.env.VITE_INDEXED_DB_VERSION,
    {
      formData: "uuid, fullName, email, city, state, zipcode",
    },
  ),
});

const root = ReactDOM.createRoot(document.getElementById("root"));

app.on("ready", async () => {
  root.render(
    <ErrorBoundary>
      <React.StrictMode>
        <MultiStepFormApplication application={app} />
      </React.StrictMode>
    </ErrorBoundary>,
  );
});
