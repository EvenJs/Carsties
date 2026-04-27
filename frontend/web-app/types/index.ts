export type PageResult<T> = {
  results: T[];
  pageCount: number;
  totalCount: number;
}

export type Auction = {
  id: string;
  reservePrice?: number
  seller: string
  winner?: any
  soldAmount?: number
  currentHighestBid?: number
  createdAt: string
  updatedAt: string
  auctionEnd: string
  status: string
  make: string
  model: string
  year: number
  color: string
  mileage: number
  imageUrl: string
}
