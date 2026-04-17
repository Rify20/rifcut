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
      return NextResponse.json(
        { error: "Missing imageUrl" },
        { status: 400 }
      );
    }

    const result = await fal.subscribe("fal-ai/birefnet/v2", {
      input: buildFalInput(
        body.imageUrl,
        body.mode ?? "studio"
      ),
      logs: true
    });

    const data: any = result.data;

    const resultUrl =
      data?.image?.url ||
      data?.images?.[0]?.url ||
      data?.output?.url ||
      data?.url ||
      null;

    if (!resultUrl) {
      console.log("FAL RESPONSE:", data);

      return NextResponse.json(
        { error: "No result image returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      resultUrl
    });

  } catch (error: any) {
    console.error("PROCESS ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to process image"
      },
      { status: 500 }
    );
  }
}
