using System.IdentityModel.Tokens.Jwt;
using InterviewsPlatform_66bit.Services;
using InterviewsPlatform_66bit.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace InterviewsPlatform_66bit.Controllers;

[Route("account")]
public class AccountController : Controller
{
    private readonly IIdentifier identifier;

    public AccountController(IIdentifier identifier)
    {
        this.identifier = identifier;
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("login")]
    public async Task<IActionResult> Login(string login, string password)
    {
        var identity = await identifier.IdentifyUser(login, password);

        if (identity is null)
        {
            return BadRequest(new {errorText = "Invalid username or password"});
        }

        var token = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            notBefore: DateTime.Now,
            claims: identity.Claims,
            expires: DateTime.Now.Add(TimeSpan.FromDays(7)),
            signingCredentials: new SigningCredentials(
                AuthOptions.GetSymmetricSecurityKey(),
                SecurityAlgorithms.HmacSha256));

        return Ok(new JwtSecurityTokenHandler().WriteToken(token));
    }
}