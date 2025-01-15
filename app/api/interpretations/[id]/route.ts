import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_ID || "6786c7eb003c9f22421c";

// Runtime check for DATABASE_ID
if (!DATABASE_ID) {
    throw new Error("Environment variable NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set.");
}

// After the check, we can assert that DATABASE_ID is a string
const database = new Databases(client);

// Fetch interpretation
async function fetchInterpretation(id: string) {
    try {
        // Use type assertion here since we've verified DATABASE_ID exists
        return await database.getDocument(DATABASE_ID as string, COLLECTION_ID, id);
    } catch (err) {
        console.error(`Error fetching interpretation with ID ${id}:`, err);
        throw new Error(`Failed to fetch interpretation with ID ${id}`);
    }
}

// Delete interpretation
async function deleteInterpretation(id: string) {
    try {
        return await database.deleteDocument(DATABASE_ID as string, COLLECTION_ID, id);
    } catch (err) {
        console.error(`Error deleting interpretation with ID ${id}:`, err);
        throw new Error(`Failed to delete interpretation with ID ${id}`);
    }
}

// Update interpretation
async function updateInterpretation(id: string, data: { term: string; interpretation: string }) {
    try {
        return await database.updateDocument(DATABASE_ID as string, COLLECTION_ID, id, data);
    } catch (err) {
        console.error(`Error updating interpretation with ID ${id}:`, err);
        throw new Error(`Failed to update interpretation with ID ${id}`);
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const interpretation = await fetchInterpretation(params.id);
        return NextResponse.json({ interpretation });
    } catch (err) {
        console.error('GET error:', err);
        return NextResponse.json(
            { error: "Failed to fetch interpretation" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await deleteInterpretation(params.id);
        return NextResponse.json({ message: "Interpretation deleted" });
    } catch (err) {
        console.error('DELETE error:', err);
        return NextResponse.json(
            { error: "Failed to delete interpretation" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const interpretation = await request.json();
        await updateInterpretation(params.id, interpretation);
        return NextResponse.json({ message: "Interpretation updated" });
    } catch (err) {
        console.error('PUT error:', err);
        return NextResponse.json(
            { error: "Failed to update interpretation" },
            { status: 500 }
        );
    }
}