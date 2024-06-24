const { dispatchToast } = require("./useToast");

describe('useToast', () => {
  it('should dispatch a toast event', () => {
    let dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');

    dispatchToast({ message: "Hello", status: "ok" });

    let dispatchedEvent = dispatchEventSpy.mock.calls[0][0];
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(dispatchedEvent.type).toBe("radfish:dispatchToast");
  })
});