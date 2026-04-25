import { NextResponse } from "next/server";
import type { ApiResponse, CityOption } from "@repo/types";

export const CITIES_LIST: CityOption[] = [
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
  const response: ApiResponse<CityOption[]> = {
    success: true,
    data: CITIES_LIST,
  };

  return NextResponse.json(response);
}
