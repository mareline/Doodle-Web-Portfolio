// Small fetch wrapper for the "say hi!" API: timeouts, friendly errors, JSON in/out.
const TIMEOUT_MS = 8000;

export async function request(path, { headers, ...options } = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "content-type": "application/json", ...headers },
    });
  } catch (error) {
    throw new Error(
      error.name === "TimeoutError"
        ? "That took too long. Please try again."
        : "Couldn’t reach the server. Check your connection and try again."
    );
  }

  const data = await response.json().catch(() => null);
  if (data === null || response.status === 404) {
    throw new Error(
      import.meta.env.DEV
        ? "The message board only works on the live site (or with `npm run dev:full`)."
        : "The message board is taking a nap. Please try again later!"
    );
  }
  if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data;
}

export const fetchNotes = () => request("/api/notes").then((data) => data.notes ?? []);

export const sendNote = (note) => request("/api/notes", { method: "POST", body: JSON.stringify(note) });
