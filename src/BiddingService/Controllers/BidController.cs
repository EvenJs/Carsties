using System;
using BiddingService.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidController : ControllerBase
{
  public async Task<ActionResult<Bid>> PlaceBid(string auctionId, int amount)
  {
    var auction = await DB.Find<Auction>().OneAsync(auctionId);

    if (auction == null)
    {
      // TODO: check with auction service if that has auction
      return NotFound();
    }

    if (auction.Seller == User.Identity?.Name)
    {
      return BadRequest("Seller cannot place bid on their own auction");
    }

    var bid = new Bid
    {
      Amount = amount,
      AuctionId = auctionId,
      Bidder = User.Identity?.Name ?? "Unknown",
    };

    if (auction.EndTime < DateTime.UtcNow)
    {
      return BadRequest("Auction has already ended");
    }
    else
    {
      var highestBid = await DB.Find<Bid>()
           .Match(a => a.AuctionId == auctionId)
           .Sort(b => b.Descending(x => x.Amount))
           .ExecuteFirstAsync();

      if (highestBid != null && amount > highestBid.Amount || highestBid == null)
      {
        bid.BidStatus = amount > auction.ReservePrice ? BidStatus.Accepted : BidStatus.AcceptedBelowReserve;
      }

      if (highestBid != null && bid.Amount <= highestBid.Amount)
      {
        bid.BidStatus = BidStatus.TooLow;
      }

    }

    await DB.SaveAsync(bid);

    return Ok(bid);
  }
}
