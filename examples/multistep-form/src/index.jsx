import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import MultiStepFormApplication from "./App";
import { Application } from "@nmfs-radfish/radfish";
import { IndexedDBConnector } from "@nmfs-radfish/radfish/storage";
import { ErrorBoundary } from "@nmfs-radfish/react-radfish";

const app = new Application({
  stores: {
    formData: {
      connector: new IndexedDBConnector("multistep-form-app"),
      collections: {
        formData: {
          schema: {
            fields: {
              id: { type: "string", primaryKey: true },
              fullName: { type: "string" },
              email: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              zipcode: { type: "string" },
              currentStep: { type: "number" },
              totalSteps: { type: "number" },
              submitted: { type: "boolean" },
            },
          },
        },
      },
    },
  },
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
