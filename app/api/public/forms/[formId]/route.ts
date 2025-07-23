import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: {
        id: params.formId,
        published: true, // Only find forms that are explicitly published
      },
    });

    // CRITICAL FIX: Check if the form was found *before* using it.
    if (!form) {
      return NextResponse.json(
        { error: "Form not found or is not published." },
        { status: 404 }
      );
    }

    // If found, return only the data needed for rendering.
    return NextResponse.json({
      name: form.name,
      json: form.json,
    });
    
  } catch (error) {
    console.error("Failed to fetch form:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
} 