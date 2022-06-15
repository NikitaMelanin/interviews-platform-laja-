using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InterviewsPlatform_66bit.DTO;

public class UserDTO
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string Login { get; set; }
    public string Password { get; set; }
    public string[] Roles { get; set; }

    public UserDTO(UserPostDTO userPostDto)
    {
        Id = ObjectId.GenerateNewId().ToString();
        Name = userPostDto.Name;
        Surname = userPostDto.Surname;
        Email = userPostDto.Email;
        Login = userPostDto.Login;
        Password = userPostDto.Password;
    }
}