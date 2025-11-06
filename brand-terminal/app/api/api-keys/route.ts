import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const generateKey = () => `bt_${randomBytes(24).toString("hex")}`;

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingKey = await db.apiKey.findFirst({
    where: { userId: session.user.id },
  });

  if (existingKey) {
    return NextResponse.json(
      { error: "API key already exists" },
      { status: 400 },
    );
  }

  const key = generateKey();

  await db.apiKey.create({
    data: {
      userId: session.user.id,
      key,
      label: "default",
    },
  });

  return NextResponse.json({ apiKey: key });
}
