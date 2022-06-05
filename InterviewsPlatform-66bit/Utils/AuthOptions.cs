using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace InterviewsPlatform_66bit.Utils;

public static class AuthOptions
{
    public const string ISSUER = "InterviewsServer"; // издатель токена
    public const string AUDIENCE = "AngularClient"; // потребитель токена
    const string KEY = "InterviewsANKPRA";   // ключ для шифрации
    public static SymmetricSecurityKey GetSymmetricSecurityKey()
    {
        return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
    }
}