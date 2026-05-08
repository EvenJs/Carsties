using System;
using BiddingService.Models;

namespace BiddingService.DTOs;

public class BidDto
{
  public string Id { get; set; }
  public string AuctionId { get; set; }
  public string Bidder { get; set; }
  public DateTime BidTime { get; set; } = DateTime.UtcNow;
  public int Amount { get; set; }
  public BidStatus BidStatus { get; set; }
}
