using System.Security.Claims;
using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Services;

public class JwtIdentifier: IIdentifier
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;

    public JwtIdentifier(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;
    }
    
    public async Task<ClaimsIdentity?> IdentifyUser(string login, string password)
    {
        var collection = dbResolver.GetMongoCollection<UserDTO>(dbName, "users");

        var builder = Builders<UserDTO>.Filter;
        var filter = builder.Eq(u => u.Login, login) &
                     builder.Eq(u => u.Password, password);

        var cursor = await collection.FindAsync(filter);

        var user = await cursor.SingleOrDefaultAsync();

        if (user == null)
        {
            return null;
        }

        var claims = new List<Claim>
        {
            new (ClaimTypes.Name, login)
        };

        claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var claimsIdentity = new ClaimsIdentity(claims);

        return claimsIdentity;
    }
}