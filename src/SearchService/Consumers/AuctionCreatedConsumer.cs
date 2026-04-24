using System;
using AutoMapper;
using Contracts;
using MassTransit;
using SearchService.Models;
using MongoDB.Entities;

namespace SearchService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
  private readonly IMapper _mapper;
  public AuctionCreatedConsumer(IMapper mapper)
  {
    _mapper = mapper;
  }

  public async Task Consume(ConsumeContext<AuctionCreated> context)
  {
    Console.WriteLine($"Received AuctionCreated event for Id: {context.Message.Id}");

    // throw new NullReferenceException("Test fault"); // 👈 temporary
    var item = _mapper.Map<Item>(context.Message);

    await item.SaveAsync();

  }
}
