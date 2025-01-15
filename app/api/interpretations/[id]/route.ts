import client from "@/lib/appwrite_client";
import { Databases } from "appwrite"; // Removed unused Models import
import { NextResponse } from "next/server";

const database = new Databases(client);

// Fetch interpretation
async function fetchInterpretation(id: string) {
    try {
        const interpretation = await database.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "6786c7eb003c9f22421c",
            id
        );
        return interpretation;
    } catch (err) { // Changed from error to err
        console.error('Error fetching interpretation:', err);
        throw new Error("Failed to fetch interpretation");
    }
}

// Delete interpretation
async function deleteInterpretation(id: string) {
    try {
        const response = await database.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "6786c7eb003c9f22421c",
            id
        );
        return response;
    } catch (err) { // Changed from error to err
        console.error('Error deleting interpretation:', err);
        throw new Error("Failed to delete interpretation");
    }
}

// Update interpretation
async function updateInterpretation(id: string, data: { term: string, interpretation: string }) {
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            "6786c7eb003c9f22421c",
            id,
            data
        );
        return response;
    } catch (err) { // Changed from error to err
        console.error('Error updating interpretation:', err);
        throw new Error("Failed to update interpretation");
    }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const interpretation = await fetchInterpretation(params.id);
        return NextResponse.json({ interpretation });
    } catch (err) { // Changed from error to err
        console.error('GET error:', err);
        return NextResponse.json(
            { error: "Failed to fetch interpretation" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await deleteInterpretation(params.id);
        return NextResponse.json({ message: "Interpretation deleted" });
    } catch (err) { // Changed from error to err
        console.error('DELETE error:', err);
        return NextResponse.json(
            { error: "Failed to delete interpretation" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const interpretation = await req.json();
        await updateInterpretation(params.id, interpretation);
        return NextResponse.json({ message: "Interpretation updated" });
    } catch (err) { // Changed from error to err
        console.error('PUT error:', err);
        return NextResponse.json(
            { error: "Failed to update interpretation" },
            { status: 500 }
        );
    }
}