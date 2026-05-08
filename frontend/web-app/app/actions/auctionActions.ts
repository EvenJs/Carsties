"use server";

import { fetchWrapper } from "@/lib/fetchWrapper";
import { Auction, Bid, PagedResult } from "@/types";
import { FieldValues } from "react-hook-form";

export async function getData(query: string): Promise<PagedResult<Auction>> {

  return fetchWrapper.get(`/search${query}`);
}

export async function updateAuctionTest(): Promise<{ status: number, message: string }> {
  const data = {
    mileage: Math.floor(Math.random() * 100000) + 1,
  }

  return fetchWrapper.put(`/auctions/6a5011a1-fe1f-47df-9a32-b5346b289391`, data);
}

export async function createAuction(data: FieldValues) {
  return fetchWrapper.post(`/auctions`, data);
}

export async function getDetails(id: string): Promise<Auction> {
  return fetchWrapper.get(`/auctions/${id}`);
}

export async function updateAuction(id: string, data: FieldValues) {
  return fetchWrapper.put(`/auctions/${id}`, data);
}

export async function deleteAuction(id: string) {
  return fetchWrapper.del(`/auctions/${id}`);
}

export async function getBidForAuction(id: string): Promise<Bid[]> {
  return fetchWrapper.get(`/bids/${id}`);
}

export async function placeBidForAuction(auctionId: string, amount: number) {
  return fetchWrapper.post(`/bids?auctionId=${auctionId}&amount=${amount}`, {})
}