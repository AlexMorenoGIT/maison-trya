"use client";

import { useState, useRef } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useSiteSettings } from "@/lib/site-settings-context";
import { createClient } from "@/lib/supabase/client";

interface EditableImageProps {
  settingKey: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export default function EditableImage({
  settingKey,
  fallbackSrc,
  alt,
  className = "",
  imgClassName = "",
}: EditableImageProps) {
  const { isAdmin } = useAdmin();
  const { get, update } = useSiteSettings();
  const [hovering, setHovering] = useState(false);
  const [editing, setEditing] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentSrc = get(settingKey, fallbackSrc);

  const handleSaveUrl = async () => {
    if (!urlInput.trim()) return;
    setError(null);
    try {
      await update(settingKey, urlInput.trim());
      setEditing(false);
      setUrlInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleUpload = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Format non supporté. Utilisez JPEG, PNG ou WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Fichier trop volumineux. Maximum 10 Mo.");
      return;
    }

    setError(null);
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${settingKey}-${Date.now()}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError("Erreur upload : " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("site-assets")
      .getPublicUrl(data.path);

    try {
      await update(settingKey, urlData.publicUrl);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
    setUploading(false);
  };

  const handleReset = async () => {
    setError(null);
    try {
      await update(settingKey, "");
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (!isAdmin) {
    return (
      <div className={`${className} w-full h-full`}>
        <img src={currentSrc} alt={alt} className={imgClassName} />
      </div>
    );
  }

  return (
    <div
      className={`group ${className} w-full h-full`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <img src={currentSrc} alt={alt} className={imgClassName} />

      {/* Admin hover overlay */}
      {hovering && !editing && (
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer z-20 transition-opacity"
          onClick={() => {
            setUrlInput(currentSrc === fallbackSrc ? "" : currentSrc);
            setEditing(true);
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
            <span className="text-white text-xs font-bold uppercase tracking-wider">Modifier l&apos;image</span>
          </div>
        </div>
      )}

      {/* Edit panel */}
      {editing && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 p-4">
          <div
            className="bg-white rounded-xl p-5 w-full max-w-sm shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-tortoise">
              Modifier l&apos;image
            </h3>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
            )}

            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="URL de l'image"
              className="w-full px-3 py-2 border border-tortoise/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveUrl}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-tortoise text-cream text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-rubber transition-colors disabled:opacity-50"
              >
                Enregistrer
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                }}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 border border-tortoise/20 text-tortoise text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-cloud transition-colors disabled:opacity-50"
              >
                {uploading ? "Upload..." : "Uploader"}
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remettre l'image par défaut"
              >
                Reset
              </button>
            </div>

            <button
              onClick={() => { setEditing(false); setError(null); }}
              className="text-xs text-tortoise/50 hover:text-tortoise transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
