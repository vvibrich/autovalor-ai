import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // We'll need to install uuid or just use crypto.randomUUID

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Nenhum arquivo enviado" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${crypto.randomUUID()}-${file.name.replace(/\s/g, "_")}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return the public URL
        // Assuming the app is hosted at root or we can use relative paths
        const url = `/uploads/${filename}`;

        return NextResponse.json({ url });

    } catch (error) {
        console.error("Erro no upload:", error);
        return NextResponse.json(
            { error: "Falha no upload do arquivo" },
            { status: 500 }
        );
    }
}
