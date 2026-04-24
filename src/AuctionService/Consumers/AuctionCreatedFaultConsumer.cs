using System;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<AuctionCreated>>
{
  public async Task Consume(ConsumeContext<Fault<AuctionCreated>> context)
  {
    Console.WriteLine("--> Consuming AuctionCreatedFault event");

    var exception = context.Message.Exceptions.First();

    if (exception.ExceptionType == "System.NullReferenceException")
    {
      context.Message.Message.Model = "FooBar";
      await context.Publish(context.Message.Message);
    }
    else
    {
      Console.WriteLine($"--> An error occurred while processing AuctionCreated event: {exception.Message}");
    }
  }
}
