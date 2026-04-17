"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

export default function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  async function handleFile(file: File) {
    try {
      setLoading(true);
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
          mode: "studio"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Gagal memproses gambar");
        return;
      }

      setResultUrl(data.resultUrl);
    } catch {
      alert("Gagal memproses gambar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-10">
      <div className="max-w-6xl mx-auto">

        <section className="text-center mb-12">
          <h1 className="text-6xl font-bold text-slate-900">
            Rif<span className="text-blue-600">Cut</span>
          </h1>

          <p className="mt-4 text-slate-600 text-lg">
            Premium AI Background Remover
          </p>
        </section>

        <section className="grid lg:grid-cols-2 gap-8">

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white">
            <h2 className="text-2xl font-semibold mb-6">
              Upload Image
            </h2>

            <div
              onClick={() => inputRef.current?.click()}
              className="h-72 rounded-3xl border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 transition flex flex-col items-center justify-center text-center px-6"
            >
              <p className="text-xl font-semibold text-blue-700">
                Click to Upload
              </p>

              <p className="mt-2 text-sm text-slate-500">
                PNG, JPG, WEBP
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {loading && (
              <div className="mt-6 text-blue-700 font-semibold animate-pulse">
                Removing background...
              </div>
            )}
          </div>

          <div className="space-y-6">

            <div className="bg-white/80 rounded-3xl p-5 shadow-xl">
              <h3 className="font-semibold mb-3">Original</h3>

              <div className="relative h-72 rounded-2xl bg-slate-100 overflow-hidden">
                {originalUrl && (
                  <Image
                    src={originalUrl}
                    alt=""
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            </div>

            <div className="bg-white/80 rounded-3xl p-5 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Result</h3>

                {resultUrl && (
                  <a
                    href={resultUrl}
                    download
                    className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm"
                  >
                    Download
                  </a>
                )}
              </div>

              <div className="relative h-72 rounded-2xl bg-slate-100 overflow-hidden">
                {resultUrl && (
                  <Image
                    src={resultUrl}
                    alt=""
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
