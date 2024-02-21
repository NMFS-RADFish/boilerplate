import React from "react";
import { render, screen } from "@testing-library/react";
import { Toast } from "../../react-radfish/alerts/index.jsx";

describe("Toast Component", () => {
  test("does not render anything when toast is not passed", () => {
    render(<Toast />);
    const toastElement = screen.queryByRole("toast-notification");
    expect(toastElement).toBeNull();
  });

  test("renders Success Alert when toast status is 'offline'", () => {
    const toast = { status: "offline", message: "Application currently offline" };
    render(<Toast toast={toast} />);
    const offlineAlert = screen.getByRole("toast-notification");
    expect(offlineAlert).toBeDefined();
    expect(screen.findByText(toast.message)).to.exist;
  });

  test("renders Success Alert when toast status is 'success'", () => {
    const toast = { status: "success", message: "Successful action" };
    render(<Toast toast={toast} />);
    const successAlert = screen.getByRole("toast-notification");
    expect(successAlert).toBeDefined();
    expect(screen.findByText(toast.message)).to.exist;
  });

  test("renders Error Alert when toast status is 'error'", () => {
    const toast = { status: "error", message: "Error occurred" };
    render(<Toast toast={toast} />);
    const errorAlert = screen.getByRole("toast-notification");
    expect(errorAlert).toBeDefined();
    expect(screen.findByText(toast.message)).to.exist;
  });

  test("does not render anything when toast status is null", () => {
    const toast = null;
    render(<Toast toast={toast} />);
    const alert = screen.queryByRole("alert");
    expect(alert).toBeNull();
  });
});
