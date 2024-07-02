import { renderHook, act } from "@testing-library/react";
import { useOfflineStatus } from "./useOfflineStatus";

describe("useToast", () => {
  it("should trigger when naviagator online switches", async () => {
    let dispatchEventSpy = vi.spyOn(window, "dispatchEvent");
    const onLineSpy = vi.spyOn(window.navigator, "onLine", "get");

    const { result, rerender } = renderHook(() => useOfflineStatus());

    onLineSpy.mockReturnValue(true);
    window.dispatchEvent(new window.Event("online"));
    rerender();

    expect(result.current.isOffline).toBe(false);

    onLineSpy.mockReturnValue(false);
    window.dispatchEvent(new window.Event("offline"));
    rerender();

    expect(result.current.isOffline).toBe(true);
  });
});
