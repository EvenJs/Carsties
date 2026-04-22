using System;
using MongoDB.Entities;

namespace SearchService.Models;

public class Item : Entity
{
  public int ReservePrice { get; set; } = 0;
  public string Seller { get; set; } = null!;
  public string? Winner { get; set; }
  public int? SoldAmount { get; set; }
  public int? CurrentHighestBid { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
  public DateTime AuctionEnd { get; set; }
  public string Status { get; set; } = null!;
  public string Make { get; set; } = null!;
  public string Model { get; set; } = null!;
  public int Year { get; set; }
  public string Color { get; set; } = null!;
  public int Mileage { get; set; }
  public string ImageUrl { get; set; } = null!;
}
