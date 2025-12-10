export const runtime = "nodejs";

export async function GET() {
    return Response.json({
        environment: process.env.NODE_ENV,
        runtime: "nodejs",
    });
}
