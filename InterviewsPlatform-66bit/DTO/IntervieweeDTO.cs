using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InterviewsPlatform_66bit.DTO;

public class IntervieweeDTO
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    
    public string Name { get; set; }
    
    public string Surname { get; set; }
    
    public string Phone { get; set; }
    
    public string Email { get; set; }
    
    public string[] Interviews { get; set; }

    public IntervieweeDTO(IntervieweePostDTO postDto)
    {
        Id = ObjectId.GenerateNewId().ToString();
        Name = postDto.Name;
        Surname = postDto.Surname;
        Phone = postDto.Phone;
        Email = postDto.Email;
        Interviews = Array.Empty<string>();
    }
}