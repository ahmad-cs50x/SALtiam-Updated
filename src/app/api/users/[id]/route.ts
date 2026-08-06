import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import { errorResponse } from "../../../../lib/routeHelpers";
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { try { await dbConnect(); const user = await User.findByIdAndDelete((await params).id); return user ? NextResponse.json({ message: "User deleted." }) : NextResponse.json({ error: "User not found." }, { status: 404 }); } catch (error) { return errorResponse(error, "Failed to delete user."); } }
