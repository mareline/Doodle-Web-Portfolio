// Private inbox at /admin.html: approve or delete "say hi!" notes.
// The key is kept only for this browser tab (sessionStorage) and sent with each request.
import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { request } from "./lib/notesApi";
import "./index.css";

const KEY_STORAGE = "notes-admin-key";

function readKey() {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

function saveKey(key) {
  try {
    if (key) sessionStorage.setItem(KEY_STORAGE, key);
    else sessionStorage.removeItem(KEY_STORAGE);
  } catch {
    // private browsing: the key just won't survive a refresh
  }
}

const formatDate = (iso) => new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

function NoteRow({ note, actions, busy, onAction }) {
  return (
    <li className="sketch-border bg-card px-4 py-3">
      <p className="font-hand text-2xl leading-snug">“{note.message}”</p>
      <p className="mt-1 text-sm opacity-70">
        — {note.name} · {formatDate(note.createdAt)}
      </p>
      <div className="mt-2 flex gap-3">
        {actions.map(([action, label]) => (
          <button
            key={action}
            type="button"
            disabled={busy}
            onClick={() => onAction(note.id, action)}
            className="cursor-pointer border-2 border-ink px-3 py-0.5 text-sm font-bold hover:bg-ink hover:text-white disabled:opacity-50"
          >
            {label}
          </button>
        ))}
      </div>
    </li>
  );
}

function Inbox() {
  const [key, setKey] = useState(readKey);
  const [draftKey, setDraftKey] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const call = useCallback(
    (options = {}) => request("/api/admin/notes", { ...options, headers: { authorization: `Bearer ${key}` } }),
    [key]
  );

  const load = useCallback(async () => {
    setError("");
    try {
      setData(await call());
    } catch (err) {
      setError(err.message);
      if (err.message === "Wrong key.") {
        saveKey("");
        setKey("");
      }
    }
  }, [call]);

  useEffect(() => {
    if (key) load();
  }, [key, load]);

  async function act(id, action) {
    if (busyId) return;
    setBusyId(id);
    try {
      await call({ method: "POST", body: JSON.stringify({ id, action }) });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (!key) {
    return (
      <form
        className="mx-auto mt-24 max-w-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          saveKey(draftKey);
          setKey(draftKey);
        }}
      >
        <h1 className="font-hand text-4xl">notes inbox</h1>
        <label className="block text-sm">
          Admin key
          <input
            type="password"
            value={draftKey}
            onChange={(e) => setDraftKey(e.target.value)}
            autoComplete="current-password"
            className="mt-1 block w-full border-2 border-ink bg-card px-3 py-2"
          />
        </label>
        <button type="submit" className="cursor-pointer border-2 border-ink bg-ink px-4 py-2 font-bold text-white">
          Open inbox
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-hand text-4xl">notes inbox</h1>
        <div className="flex gap-4 text-sm">
          <button type="button" onClick={load} className="cursor-pointer underline">Refresh</button>
          <button
            type="button"
            onClick={() => {
              saveKey("");
              setKey("");
              setData(null);
            }}
            className="cursor-pointer underline"
          >
            Lock
          </button>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 border-2 border-ink bg-card p-3">{error}</p>}
      {!data && !error && <p className="mt-8 animate-pulse">Loading…</p>}

      {data && (
        <>
          <h2 className="mt-10 font-bold">Waiting for review ({data.pending.length})</h2>
          {data.pending.length === 0 ? (
            <p className="mt-3 opacity-70">All caught up!</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {data.pending.map((note) => (
                <NoteRow
                  key={note.id}
                  note={note}
                  busy={busyId !== null}
                  onAction={act}
                  actions={[["approve", "Approve"], ["delete", "Delete"]]}
                />
              ))}
            </ul>
          )}

          <h2 className="mt-12 font-bold">On the site ({data.approved.length})</h2>
          {data.approved.length === 0 ? (
            <p className="mt-3 opacity-70">Nothing approved yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {data.approved.map((note) => (
                <NoteRow key={note.id} note={note} busy={busyId !== null} onAction={act} actions={[["delete", "Remove"]]} />
              ))}
            </ul>
          )}
          <p className="mt-10 text-xs opacity-60">Approved notes can take up to a minute to appear on the site.</p>
        </>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Inbox />
  </StrictMode>
);
