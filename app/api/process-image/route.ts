import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { buildFalInput, type RifMode } from "@/lib/fal";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      imageUrl?: string;
      mode?: RifMode;
    };

    if (!body.imageUrl) {
      return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
    }

    const result = await fal.subscribe("fal-ai/birefnet/v2", {
      input: buildFalInput(body.imageUrl, body.mode ?? "standard"),
      logs: true
    });

    const output = result.data as {
      image?: {
        url?: string;
      };
    };

    const resultUrl = output?.image?.url;

    if (!resultUrl) {
      return NextResponse.json({ error: "No result image" }, { status: 500 });
    }

    return NextResponse.json({ resultUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}