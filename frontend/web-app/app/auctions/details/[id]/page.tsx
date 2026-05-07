import { getBidForAuction, getDetails } from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import CountdownTimer from "../../CountdownTimer";
import CardImage from "../../CardImage";
import DetailedSpecs from "./DetailedSpecs";
import EditButton from "./EditButton";
import { getCurrentUser } from "@/app/actions/authActions";
import DeleteButton from "./DeleteButton";
import BidItem from "./BidItem";

export default async function Details({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getDetails(id);
  const user = await getCurrentUser();
  const bids = await getBidForAuction(id);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Heading title={`${data.make} ${data.model}`} />
          {user?.username === data.seller && <EditButton id={id} />}
          {user?.username === data.seller && <DeleteButton id={id} />}
        </div>

        <div className="flex gap-3">
          <h3 className="text-2xl font-semibold">Time remaining:</h3>
          <CountdownTimer auctionEnd={data.auctionEnd} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-3">
        <div className="relative w-full bg-gray-200 aspect-4/3 rounded-lg overflow-hidden">
          <CardImage imageUrl={data.imageUrl} />
        </div>
        <div className="border-2 rounded-lg p-2 bg-gray-200">
          <Heading title="Bids" />
          {bids.map((bid) => (
            <BidItem key={bid.id} bid={bid} />
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 rounded-lg">
        <DetailedSpecs auction={data} />
      </div>
    </>
  );
}
