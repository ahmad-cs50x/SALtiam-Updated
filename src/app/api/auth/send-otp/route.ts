import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import { otpStore } from "../../../../lib/otpStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.toString()?.trim()?.toLowerCase();
    const purpose = body?.purpose || "register";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await dbConnect();
    const existingUser = await User.findOne({ email });

    if (purpose === "register" && existingUser) {
      return NextResponse.json({ error: "Email already exists. Please sign in instead." }, { status: 400 });
    }

    if (purpose === "reset" && !existingUser) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    // Placeholder: in production you should send the OTP by email
    console.log(`OTP for ${email}: ${otp}`);

    return NextResponse.json({ message: "OTP has been sent." });
  } catch (error) {
    console.error("send-otp error", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
