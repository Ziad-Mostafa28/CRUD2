import client from "@/lib/appwrite_client";
import { Databases, ID, Query, Models } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// create interpretation
async function createInterpretation(data: {
  term: string;
  interpretation: string;
}): Promise<Models.Document> {
  try {
    const document = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "6786c7eb003c9f22421c",
      ID.unique(),
      data
    );
    return document;
  } catch (err) {
    console.error("Error creating interpretation:", err);
    throw new Error("Failed to create interpretation");
  }
}

// fetch interpretation
async function fetchInterpretations(): Promise<Models.Document[]> {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "6786c7eb003c9f22421c",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (err) {
    console.error("Error fetching interpretations:", err);
    throw new Error("Failed to fetch interpretations");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    const document = await createInterpretation(data);
    
    return NextResponse.json({ 
      message: "Interpretation created", 
      document 
    });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      {
        error: "Failed to create interpretation"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interpretations = await fetchInterpretations();
    console.log("API response:", interpretations);
    return NextResponse.json(interpretations);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch interpretations" },
      { status: 500 }
    );
  }
}