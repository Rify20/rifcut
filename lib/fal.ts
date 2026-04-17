import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY
});

export type RifMode = "standard" | "hair" | "studio";

export function buildFalInput(imageUrl: string, mode: RifMode) {
  if (mode === "hair") {
    return {
      image_url: imageUrl,
      sync_mode: true,
      output_format: "png",
      operating_resolution: 2048,
      refine_foreground: true,
      task_type: "portrait"
    };
  }

  if (mode === "studio") {
    return {
      image_url: imageUrl,
      sync_mode: true,
      output_format: "png",
      operating_resolution: 2304,
      refine_foreground: true,
      task_type: "general"
    };
  }

  return {
    image_url: imageUrl,
    sync_mode: true,
    output_format: "png",
    operating_resolution: 1536,
    refine_foreground: true,
    task_type: "general"
  };
}