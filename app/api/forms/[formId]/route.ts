import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getUserIdFromSession(session: any) {
  if (session.user && session.user.id) return session.user.id;
  if (session.user && session.user.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    return user?.id;
  }
  return null;
}

export async function GET(request: Request, { params }: { params: { formId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = await getUserIdFromSession(session);
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  try {
    const form = await prisma.form.findUnique({
      where: {
        id: params.formId,
        userId: userId,
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { formId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = await getUserIdFromSession(session);
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const { name, json, published } = await request.json();

  try {
    const updatedForm = await prisma.form.update({
      where: {
        id: params.formId,
        userId: userId,
      },
      data: {
        name,
        json,
        published,
      },
    });
    return NextResponse.json(updatedForm);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { formId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = await getUserIdFromSession(session);
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  try {
    await prisma.form.delete({
      where: {
        id: params.formId,
        userId: userId,
      },
    });
    return NextResponse.json({ message: "Form deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
} 