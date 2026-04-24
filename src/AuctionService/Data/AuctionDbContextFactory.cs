using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AuctionService.Data;

public class AuctionDbContextFactory : IDesignTimeDbContextFactory<AuctionDbContext>
{
  public AuctionDbContext CreateDbContext(string[] args)
  {
    var optionsBuilder = new DbContextOptionsBuilder<AuctionDbContext>();
    optionsBuilder.UseNpgsql("Host=localhost;Database=auctions;Username=postgres;Password=postgrespw");

    return new AuctionDbContext(optionsBuilder.Options);
  }
}