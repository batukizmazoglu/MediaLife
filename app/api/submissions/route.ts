import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { formId, data } = await request.json();

    if (!formId || !data) {
      return NextResponse.json({ error: "Missing formId or submission data" }, { status: 400 });
    }

    // This is the corrected logic.
    // We perform a single, atomic update operation to push the new submission
    // into the 'submissions' array of the specified form.
    await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        submissions: {
          push: data,
        },
      },
    });

    return NextResponse.json({ message: "Submission saved successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error saving submission:", error);
    // If the update fails (e.g., formId not found), Prisma will throw an error
    // which will be caught here.
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
} 