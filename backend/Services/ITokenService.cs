using NaffBrightFarm.Api.Entities;

namespace NaffBrightFarm.Api.Services;

public interface ITokenService
{
    string CreateToken(User user);
}