using System.IdentityModel.Tokens.Jwt;
using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Services;
using InterviewsPlatform_66bit.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Controllers;

[Route("account")]
public class AccountController : Controller
{
    private readonly IIdentifier identifier;
    private readonly IDBResolver dbResolver;
    private readonly string dbName;

    public AccountController(IIdentifier identifier, IDBResolver dbResolver, string dbName)
    {
        this.identifier = identifier;
        this.dbResolver = dbResolver;
        this.dbName = dbName;
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("login")]
    [Produces("application/json")]
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

    [HttpPost]
    [Authorize(Roles = Roles.ADMINISTRATOR)]
    [Route("register-hr")]
    [Produces("application/json")]
    public async Task<IActionResult> RegisterHr([FromBody] UserPostDTO userPostDto)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var usersCollection = dbResolver.GetMongoCollection<UserDTO>(dbName, "users");

            var filterBuilder = Builders<UserDTO>.Filter;

            var filter = filterBuilder.Eq(u => u.Login, userPostDto.Login) &
                         filterBuilder.Eq(u => u.Password, userPostDto.Password);

            var users = await usersCollection.FindAsync(filter);

            if (await users.AnyAsync())
            {
                return Conflict(new {errorText = "User with this login and password already registered"});
            }

            var user = new UserDTO(userPostDto) {Roles = new[] {Roles.HR}};

            await usersCollection.InsertOneAsync(user);

            return Ok(user.Id);
        }, BadRequest(), NotFound());
}