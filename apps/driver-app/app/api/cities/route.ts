import { NextResponse } from "next/server";

export const CITIES_LIST = [
  { key: "delhi", name: "Delhi" },
  { key: "mumbai", name: "Mumbai" },
  { key: "jaipur", name: "Jaipur" },
  { key: "bangalore", name: "Bangalore" },
  { key: "hyderabad", name: "Hyderabad" },
  { key: "chennai", name: "Chennai" },
  { key: "pune", name: "Pune" },
  { key: "ahmedabad", name: "Ahmedabad" },
  { key: "kolkata", name: "Kolkata" },
  { key: "lucknow", name: "Lucknow" },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: CITIES_LIST,
  });
}