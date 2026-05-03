using System;
using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
  private readonly IMapper _mapper;
  private readonly IPublishEndpoint _publishEndpoint;

  public BidsController(IMapper mapper, IPublishEndpoint publishEndpoint)
  {
    _mapper = mapper;
    _publishEndpoint = publishEndpoint;
  }

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<BidDto>> PlaceBid(string auctionId, int amount)
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

    if (auction.AuctionEnd < DateTime.UtcNow)
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

    await _publishEndpoint.Publish(_mapper.Map<BidPlaced>(bid));

    return Ok(_mapper.Map<BidDto>(bid));
  }

  [HttpGet("{auctionId}")]
  public async Task<ActionResult<List<BidDto>>> GetBidsForAuction(string auctionId)
  {
    var bids = await DB.Find<Bid>()
      .Match(a => a.AuctionId == auctionId)
      .Sort(b => b.Descending("BidDate"))
      .ExecuteAsync();

    return bids.Select(_mapper.Map<BidDto>).ToList();
  }
}
