import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import User from "../../../models/User";
import { errorResponse } from "../../../lib/routeHelpers";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json(await User.find().select("-password").sort({ createdAt: -1 }).lean());
  } catch (error) { return errorResponse(error, "Failed to load users."); }
}
