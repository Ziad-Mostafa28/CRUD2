"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface IInterpretation {
  $id: string;
  term: string;
  interpretation: string;
}

export default function Home() {
  const [interpretations, setInterpretations] = useState<IInterpretation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/interpretations");

        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();
        setInterpretations(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load interpretations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterpretations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/interpretations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete interpretation");
      }

      setInterpretations((prevInterpretations) =>
        prevInterpretations.filter((i) => i.$id !== id)
      );
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete interpretation. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <p>Loading...</p>
        </div>
      ) : interpretations.length > 0 ? (
        <div>
          {interpretations.map((interpretation) => (
            <div
              key={interpretation.$id}
              className="p-4 my-2 rounded-md border-b leading-8"
            >
              <div className="font-bold">{interpretation.term}</div>
              <div>{interpretation.interpretation}</div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest hover:bg-slate-300 transition-colors"
                  href={`/edit/${interpretation.$id}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(interpretation.$id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No interpretations found</p>
      )}
    </div>
  );
}