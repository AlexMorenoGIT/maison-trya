"use client";

import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useSiteSettings } from "@/lib/site-settings-context";

interface EditableTextProps {
  settingKey: string;
  fallback: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  multiline?: boolean;
}

export default function EditableText({
  settingKey,
  fallback,
  as: Tag = "p",
  className = "",
  multiline = false,
}: EditableTextProps) {
  const { isAdmin } = useAdmin();
  const { get, update } = useSiteSettings();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [hovering, setHovering] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const currentText = get(settingKey, fallback);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      // Auto-resize textarea to fit content
      if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
        const ta = inputRef.current;
        ta.style.height = "auto";
        ta.style.height = Math.max(120, ta.scrollHeight) + "px";
      }
    }
  }, [editing, multiline]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const trimmed = value.trim();
      // Save empty string to reset to fallback
      await update(settingKey, trimmed === fallback ? "" : trimmed);
      setEditing(false);
    } catch {
      // silently fail
    }
    setSaving(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setEditing(false);
    }
  };

  if (!isAdmin) {
    return <Tag className={className}>{currentText}</Tag>;
  }

  if (editing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              // Auto-resize on input
              const ta = e.target;
              ta.style.height = "auto";
              ta.style.height = Math.max(120, ta.scrollHeight) + "px";
            }}
            onKeyDown={handleKeyDown}
            rows={6}
            className={`${className} w-full bg-white/90 border-2 border-gold rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-y !text-base !leading-relaxed !tracking-normal !text-tortoise`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} w-full bg-white/90 border-2 border-gold rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/50`}
            style={{ color: "inherit" }}
          />
        )}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 bg-tortoise text-cream text-xs font-bold uppercase tracking-wider rounded hover:bg-rubber transition-colors disabled:opacity-50"
          >
            {saving ? "..." : "Enregistrer"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 text-xs text-tortoise/50 hover:text-tortoise transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      className={`${className} ${hovering ? "outline outline-2 outline-dashed outline-gold/60 rounded cursor-pointer" : "cursor-pointer"}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => {
        setValue(currentText);
        setEditing(true);
      }}
      title="Cliquer pour modifier"
    >
      {currentText}
      {hovering && (
        <span className="ml-2 inline-flex items-center align-middle">
          <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
          </svg>
        </span>
      )}
    </Tag>
  );
}
