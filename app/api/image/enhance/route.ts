// /app/api/image/enhance/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ No sharp — send buffer directly as PNG
    const imageFile = await toFile(buffer, "image.png", { type: "image/png" });

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
       prompt: `
Restore and enhance this old photograph while strictly preserving its original composition, framing, and dimensions.

CRITICAL CONSTRAINTS:
- Keep EXACT same width, height, and aspect ratio (no resizing)
- Do NOT crop, zoom, rotate, or reframe
- Do NOT change facial structure, identity, or expression
- Do NOT add or remove any objects or background elements

RESTORATION TASKS:
- Remove scratches, cracks, stains, and physical damage
- Fix faded or uneven areas
- Correct color issues (yellowing, sepia imbalance, dual tones)
- Restore natural and consistent skin tones
- Improve sharpness and clarity
- Reduce noise and blur
- Balance lighting and contrast

STYLE:
- Keep it realistic and natural
- Do NOT over-smooth or apply artificial filters

OUTPUT:
Return the same image, fully restored and cleaned, with identical dimensions and composition.
`,
      size: "1024x1024",
    });

    const imageBase64 = response?.data?.[0]?.b64_json;
    if (!imageBase64) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
    });

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Enhancement failed" },
      { status: 500 }
    );
  }
}