import { useCallback, useRef, useState } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside.js";

// Custom dropdown: useRef + outside click + Escape key
export default function Dropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useOnClickOutside(ref, close);

  const current = options.find((option) => option.value === value);

  return (
    <div className="dropdown" ref={ref} onKeyDown={(e) => e.key === "Escape" && close()}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{current?.label}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {open && (
        <ul className="dropdown-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={option.value === value ? "selected" : ""}
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
