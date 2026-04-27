"use server";

import { Auction, PageResult } from "@/types";

export async function getData(pageNumber: number, pageSize: number): Promise<PageResult<Auction>> {
  const res = await fetch(`http://localhost:6001/search?pagesize=${pageSize}&pagenumber=${pageNumber}`);

  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json();
}
