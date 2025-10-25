import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow all requests through - add custom logic here if needed
    return NextResponse.next();
}