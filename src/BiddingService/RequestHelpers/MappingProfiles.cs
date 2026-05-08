using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;
using Contracts;

namespace BiddingService.RequestHelpers;

public class MappingProfiles : Profile
{
  public MappingProfiles()
  {
    CreateMap<Bid, BidDto>().ForMember(d => d.Id, o => o.MapFrom(s => s.ID));
    CreateMap<Bid, BidPlaced>();
  }
}
