import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId).select("name email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
