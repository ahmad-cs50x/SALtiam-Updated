import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import Review from "../../../models/Review";
import { errorResponse } from "../../../lib/routeHelpers";
export async function GET() { try { await dbConnect(); return NextResponse.json(await Review.find().sort({ createdAt: -1 }).lean()); } catch (error) { return errorResponse(error, "Failed to load reviews."); } }
