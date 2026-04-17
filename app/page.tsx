"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { Download, ImagePlus, Sparkles } from "lucide-react";

type RifMode = "standard" | "hair" | "studio";

export default function HomePage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = useState<RifMode>("studio");
  const [loading, setLoading] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Upload file gambar ya");
      return;
    }

    try {
      setLoading(true);
      setFileName(file.name);
      setResultUrl("");

      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload"
      });

      setOriginalUrl(blob.url);

      const res = await fetch("/api/process-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageUrl: blob.url,
          mode
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to process image");
      }

      setResultUrl(data.resultUrl);
    } catch (error) {
      console.error(error);
      alert("Gagal memproses gambar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur-xl md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
            HD AI Background Remover
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            RifCut
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Remove background with elegant HD results using BiRefNet v2.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
          <div className="rounded-[24px] border-2 border-dashed border-brand-200 bg-gradient-to-br from-white to-blue-50 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white">
              <ImagePlus className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
              Upload image
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Upload foto dan RifCut akan menghapus background dengan hasil HD,
              bersih, dan rapi.
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Pilih Gambar
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { key: "standard", label: "Standard" },
              { key: "hair", label: "Hair Detail" },
              { key: "studio", label: "Studio HD" }
            ].map((item) => {
              const active = mode === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key as RifMode)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-brand-300"
                  }`}
                >
                  <p className="font-medium text-slate-900">{item.label}</p>
                </button>
              );
            })}
          </div>

          {fileName && (
            <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-slate-600">
              File: <span className="font-medium text-slate-900">{fileName}</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-xl">
            <p className="mb-3 text-sm font-medium text-slate-500">Original</p>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
              {originalUrl ? (
                <Image
                  src={originalUrl}
                  alt="Original"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Belum ada gambar
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Result</p>

              {resultUrl && !loading && (
                <a
                  href={resultUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              )}
            </div>

            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-white via-brand-50 to-blue-50">
              {loading ? (
                <div className="flex flex-col items-center gap-3 text-brand-700">
                  <Sparkles className="h-8 w-8 animate-pulse" />
                  <p className="text-sm font-medium">Processing HD cutout...</p>
                </div>
              ) : resultUrl ? (
                <Image
                  src={resultUrl}
                  alt="Result"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="text-sm text-slate-400">
                  Hasil akan muncul di sini
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}