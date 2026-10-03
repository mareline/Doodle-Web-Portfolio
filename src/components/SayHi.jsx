import { useEffect, useRef, useState } from "react";
import Note from "./Note";
import Reveal from "./Reveal";
import { fetchNotes, sendNote } from "../lib/notesApi";

const MAX_LENGTH = 280;
const WALL_PAGE = 9;
const NOTE_TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-[-3deg]", "rotate-[1.5deg]"];

const newFormKey = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function PaperPlane({ onDone }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 48"
      onAnimationEnd={onDone}
      className="plane-fly pointer-events-none absolute top-1/3 left-1/3 z-30 h-12 w-16 fill-card stroke-ink"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M2 22 L62 2 L40 44 L28 28 Z" />
      <path d="M62 2 L28 28 L24 42 L33 32" />
    </svg>
  );
}

function MessageForm({ onSent }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | flying | sent | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const formKey = useRef(newFormKey());
  const startedAt = useRef(Date.now());
  const honeypot = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "sending" || status === "flying") return;
    if (!message.trim()) {
      setError("Write something first!");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const response = await sendNote({
        name,
        message,
        website: honeypot.current?.value ?? "",
        startedAt: startedAt.current,
        // Same key on retries, so a slow request that actually went through isn't saved twice
        idempotencyKey: formKey.current,
      });
      setResult(response);
      if (prefersReducedMotion()) {
        setStatus("sent");
        if (response.note) onSent(response.note, response.status);
      } else {
        setStatus("flying"); // finishSending runs when the paper plane has flown off
      }
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  function finishSending() {
    setStatus("sent");
    if (result?.note) onSent(result.note, result.status);
  }

  function writeAnother() {
    setMessage("");
    setError("");
    setResult(null);
    formKey.current = newFormKey();
    startedAt.current = Date.now();
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <Note className="text-2xl">
        {result?.status === "approved" ? "posted! ♡" : "sent! thank you ♡"}
        <span className="mt-1 block text-lg leading-snug opacity-80">
          {result?.status === "approved"
            ? "it’s up on the wall below."
            : "it’s on the wall below for you now, and everyone will see it once I’ve read and approve it!"}
        </span>
        <button type="button" onClick={writeAnother} className="mt-2 cursor-pointer text-lg underline underline-offset-4">
          write another
        </button>
      </Note>
    );
  }

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`taped sketch-border relative rotate-1 bg-card px-5 pt-7 pb-4 shadow-[3px_4px_0_rgba(0,0,0,0.08)] ${
          status === "flying" ? "note-fold" : ""
        }`}
      >
        <h3 className="flex items-center gap-2 font-hand text-3xl leading-none">
          write a cute msg!
          <svg aria-hidden="true" viewBox="0 0 32 32" className="pencil-wiggle h-7 w-7 fill-none stroke-ink" strokeWidth="2" strokeLinejoin="round">
            <path d="M6 26 L8 19 L22 5 L27 10 L13 24 Z M8 19 L13 24 M19 8 L24 13 M6 26 L10 25" />
          </svg>
        </h3>

        <label htmlFor="hi-name" className="sr-only">Your name (optional)</label>
        <input
          id="hi-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          autoComplete="name"
          placeholder="your name (optional)"
          className="lined-input mt-3"
        />

        <label htmlFor="hi-message" className="sr-only">Your message</label>
        <textarea
          id="hi-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="leave something sweet…"
          className="lined-input lined-textarea mt-2"
        />

        {/* Hidden from people; bots tend to fill it in */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="font-hand text-base opacity-60">
            {message.length}/{MAX_LENGTH}
          </span>
          <button
            type="submit"
            disabled={status === "sending" || status === "flying"}
            className="sketch-border cursor-pointer bg-paper/40 px-4 py-0.5 font-hand text-xl transition-transform hover:-rotate-3 disabled:cursor-wait disabled:opacity-60"
          >
            {status === "sending" ? "sending…" : "send ✈"}
          </button>
        </div>

        {status === "error" && (
          <p role="alert" className="mt-2 font-hand text-lg leading-snug">
            {error}
          </p>
        )}
      </form>

      {status === "flying" && <PaperPlane onDone={finishSending} />}
    </div>
  );
}

function MessageWall({ notes, status }) {
  const [visible, setVisible] = useState(WALL_PAGE);

  if (status === "error") return null; // the form still works; the wall just stays hidden
  const remaining = notes.length - visible;

  return (
    <div className="mt-16">
      <h3 className="-rotate-1 font-hand text-3xl">the message wall ♡</h3>

      {status === "loading" && <p className="mt-4 animate-pulse font-hand text-xl opacity-60">pinning up notes…</p>}
      {status === "ready" && notes.length === 0 && (
        <p className="mt-4 font-hand text-xl opacity-70">no messages yet. be the first! ✎</p>
      )}

      {notes.length > 0 && (
        <Reveal as="ul" className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {notes.slice(0, visible).map((note, i) => (
            <li
              key={note.id}
              style={{ animationDelay: `${(i % WALL_PAGE) * 90}ms` }}
              className={`note-pop taped sketch-border relative bg-card px-4 pt-6 pb-3 font-hand text-xl leading-snug shadow-[3px_4px_0_rgba(0,0,0,0.08)] ${
                NOTE_TILTS[i % NOTE_TILTS.length]
              }`}
            >
              <p>“{note.message}”</p>
              <p className="mt-1 text-right text-lg opacity-70">— {note.name}</p>
              {note.mine && (
                <p className="mt-1 text-right font-body text-[11px] opacity-60">only you can see this until I approve it</p>
              )}
            </li>
          ))}
        </Reveal>
      )}

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + WALL_PAGE)}
          className="mx-auto mt-8 block cursor-pointer font-hand text-2xl underline underline-offset-4"
        >
          more messages ({remaining})
        </button>
      )}
    </div>
  );
}

// Contact-section message board: `children` (your contact links) sit beside the form, the wall goes underneath.
export default function SayHi({ children }) {
  const [wall, setWall] = useState({ status: "loading", notes: [] });

  useEffect(() => {
    let active = true;
    fetchNotes()
      .then((notes) => active && setWall({ status: "ready", notes }))
      .catch(() => active && setWall({ status: "error", notes: [] }));
    return () => {
      active = false;
    };
  }, []);

  // Pop the sender's own note onto the wall straight away
  function addOwnNote(note, status) {
    setWall((current) => ({
      status: current.status === "error" ? "ready" : current.status,
      notes: [{ ...note, mine: status !== "approved" }, ...current.notes.filter((n) => n.id !== note.id)],
    }));
  }

  return (
    <>
      <div className="mt-10 grid items-start gap-12 md:grid-cols-2">
        <div>{children}</div>
        <MessageForm onSent={addOwnNote} />
      </div>
      <MessageWall notes={wall.notes} status={wall.status} />
    </>
  );
}
