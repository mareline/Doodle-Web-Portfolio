import { useEffect, useRef, useState } from "react";
export default function WompWomp() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const block = (event) => {
      event.preventDefault();
      setOpen(true);
    };
    const onKey = (event) => {
      const key = event.key.toLowerCase();
      const inspect =
        event.key === "F12" ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && key === "u");
      if (inspect) block(event);
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
      aria-labelledby="womp-title"
      className="desk-window sketch-border m-auto w-[min(90vw,22rem)] bg-card p-0 text-center text-ink backdrop:bg-ink/30"
    >
      {open && (
        <div className="px-6 pt-7 pb-6">
          <p id="womp-title" className="font-hand text-5xl leading-none">womp womp</p>
          <p className="mt-3 font-hand text-xl opacity-75">no peeking behind the sketchbook ♡</p>
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current.close()}
            className="sketch-border mt-5 cursor-pointer bg-white/80 px-5 py-1 font-hand text-2xl transition-transform hover:-rotate-2"
          >
            back to the site →
          </button>
        </div>
      )}
    </dialog>
  );
}
