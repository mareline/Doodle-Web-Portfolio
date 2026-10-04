import { useState } from "react";

// <img> that fades in once loaded and swaps to `fallback` if the file is missing or fails.
export default function SafeImage({ src, alt = "", className = "", fallback = null, onLoad, onError, priority = false, ...rest }) {
  const [status, setStatus] = useState("loading");

  if (status === "error") return fallback;

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
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
