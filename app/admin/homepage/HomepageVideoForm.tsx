"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface HomepageVideoFormProps {
  currentVideoUrl: string;
}

export default function HomepageVideoForm({ currentVideoUrl }: HomepageVideoFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState(currentVideoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const supabase = createClient();

  const handleFileUpload = async (file: File) => {
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      setError("Format non supporté. Utilisez MP4, WebM ou MOV.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("Fichier trop volumineux. Maximum 100 Mo.");
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress("Upload en cours...");

    const ext = file.name.split(".").pop();
    const fileName = `hero-video-${Date.now()}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setError("Erreur upload : " + uploadError.message);
      setUploading(false);
      setUploadProgress(null);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("site-assets")
      .getPublicUrl(data.path);

    setVideoUrl(urlData.publicUrl);
    setUploading(false);
    setUploadProgress(null);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    const { error: upsertError } = await supabase
      .from("site_settings")
      .upsert({ key: "hero_video_url", value: videoUrl }, { onConflict: "key" });

    if (upsertError) {
      setError("Erreur : " + upsertError.message);
      setSaving(false);
      return;
    }

    setSuccess("Video enregistrée avec succès.");
    setSaving(false);
    router.refresh();
  };

  const handleRemove = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    const { error: upsertError } = await supabase
      .from("site_settings")
      .upsert({ key: "hero_video_url", value: "" }, { onConflict: "key" });

    if (upsertError) {
      setError("Erreur : " + upsertError.message);
      setSaving(false);
      return;
    }

    setVideoUrl("");
    setSuccess("Video supprimée. Le hero par défaut sera affiché.");
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="max-w-3xl space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Video Hero Section */}
      <section className="bg-white rounded-xl border border-tortoise/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-tortoise/10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-tortoise">
            Vidéo Hero
          </h2>
          <p className="text-xs text-tortoise/50 mt-1">
            Vidéo affichée en arrière-plan du hero sur la page d&apos;accueil. Formats acceptés : MP4, WebM, MOV. Max 100 Mo.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview */}
          {videoUrl ? (
            <div className="relative aspect-video bg-tortoise rounded-lg overflow-hidden">
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-cream text-sm font-bold uppercase tracking-wider bg-black/50 px-4 py-2 rounded">
                  Aperçu
                </span>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-tortoise/5 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-tortoise/20">
              <svg className="w-12 h-12 text-tortoise/20 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <p className="text-sm text-tortoise/40">Aucune vidéo configurée</p>
              <p className="text-xs text-tortoise/30 mt-1">Le hero par défaut sera affiché</p>
            </div>
          )}

          {/* Upload / URL */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tortoise mb-1.5">
                URL de la vidéo
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://... ou uploadez un fichier ci-dessous"
                className="w-full px-4 py-3 border border-tortoise/20 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-tortoise/20 text-tortoise text-sm font-medium rounded-lg hover:bg-cloud transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                {uploading ? uploadProgress : "Uploader une vidéo"}
              </button>

              {videoUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>

          {/* Save */}
          <div className="pt-4 border-t border-tortoise/10">
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="px-8 py-3 bg-tortoise text-cream text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-rubber transition-colors disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
