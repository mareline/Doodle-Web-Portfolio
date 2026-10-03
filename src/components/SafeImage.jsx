import { useState } from "react";

// <img> that fades in once loaded and swaps to `fallback` if the file is missing or fails.
export default function SafeImage({ src, alt = "", className = "", fallback = null, onLoad, onError, ...rest }) {
  const [status, setStatus] = useState("loading");

  if (status === "error") return fallback;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onLoad={(event) => {
        setStatus("loaded");
        onLoad?.(event);
      }}
      onError={() => {
        setStatus("error");
        onError?.();
      }}
      className={`transition-opacity duration-500 ${status === "loaded" ? "opacity-100" : "opacity-0"} ${className}`}
      {...rest}
    />
  );
}
