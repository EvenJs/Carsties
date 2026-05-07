import CountdownTimer from "./CountdownTimer";
import CardImage from "./CardImage";
import { Auction } from "@/types";
import Link from "next/link";
import CurrentBid from "./CurrentBid";

type Props = {
  auction: Auction;
};

export default function AuctionCard({ auction }: Props) {
  return (
    <Link href={`/auctions/details/${auction.id}`}>
      <div className="relative w-full bg-gray-200 aspect-16/10 rounded-lg overflow-hidden">
        <CardImage
          imageUrl={
            auction.imageUrl && auction.imageUrl.startsWith("http")
              ? auction.imageUrl
              : "/placeholder.jpg"
          }
        />
        <div className="absolute bottom-2 left-2">
          <CountdownTimer auctionEnd={auction.auctionEnd} />
        </div>
        <div className="absolute top-2 right-2">
          <CurrentBid
            reservePrice={auction.reservePrice}
            amount={auction.currentHighestBid}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-gray-700">
          {auction.make} {auction.model}
        </h3>
        <p className="font-semibold text-sm">{auction.year}</p>
      </div>
    </Link>
  );
}
