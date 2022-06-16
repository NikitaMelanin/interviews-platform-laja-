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

            var filter = Builders<UserDTO>.Filter.Eq(u => u.Login, userPostDto.Login);

            var users = await usersCollection.FindAsync(filter);

            if (await users.AnyAsync())
            {
                return Conflict(new {errorText = "User with this login already registered"});
            }

            var user = new UserDTO(userPostDto) {Roles = new[] {Roles.HR}};

            await usersCollection.InsertOneAsync(user);

            return Ok(user.Id);
        }, BadRequest(), NotFound());

    [HttpDelete]
    [Authorize(Roles = Roles.ADMINISTRATOR)]
    public async Task<IActionResult> DeleteAccount(string loginToDelete)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var usersCollection = dbResolver.GetMongoCollection<UserDTO>(dbName, "users");

            var filter = Builders<UserDTO>.Filter.Eq(u => u.Login, loginToDelete);

            var user = (await usersCollection.FindAsync(filter)).Single();

            if (user.Roles.Contains(Roles.ADMINISTRATOR))
            {
                return Forbid();
            }

            var deleteFilter = Builders<UserDTO>.Filter.Eq(u => u.Id, user.Id);

            await usersCollection.DeleteOneAsync(deleteFilter);
                
            return NoContent();
        }, BadRequest(), NotFound(new {errorText = "Bad login"}));

}