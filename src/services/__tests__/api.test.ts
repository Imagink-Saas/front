import { apiService } from "@/services/api";

describe("apiService.generateImage", () => {
  const originalFetch = global.fetch;
  const originalWindow = global.window;

  beforeEach(() => {
    // Mock Clerk
    // @ts-expect-error
    global.window = {
      ...originalWindow,
      Clerk: {
        session: {
          getToken: jest.fn().mockResolvedValue("tok_test"),
        },
      },
    } as any;

    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch as any;
    // @ts-expect-error
    global.window = originalWindow;
    jest.resetAllMocks();
  });

  it("returns blob when samples=1", async () => {
    const blob = new Blob(["x"], { type: "image/png" });
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(blob),
    });

    const result = await apiService.generateImage({
      prompt: "cat",
      samples: 1,
    });
    expect(result).toBeInstanceOf(Blob);
    expect(global.fetch as jest.Mock).toHaveBeenCalled();
  });

  it("returns json when samples>1", async () => {
    const json = { success: true, images: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(json),
    });

    const result = await apiService.generateImage({
      prompt: "cat",
      samples: 2,
    });
    expect(result).toEqual(json);
  });
});
