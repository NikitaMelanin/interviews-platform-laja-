using System.Security.Claims;

namespace InterviewsPlatform_66bit.Services;

public interface IIdentifier
{
    public Task<ClaimsIdentity?> IdentifyUser(string login, string password);
}