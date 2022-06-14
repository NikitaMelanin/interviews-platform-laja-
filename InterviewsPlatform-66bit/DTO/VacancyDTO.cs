using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InterviewsPlatform_66bit.DTO;

public class VacancyDTO
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    
    public string Name { get; set; }
    
    public string Description { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreatorId { get; set; }

    public string[] Questions { get; set; }
    
    public string[] Interviews { get; set; }

    public VacancyDTO(VacancyPostDTO postDto)
    {
        Id = ObjectId.GenerateNewId().ToString();
        Name = postDto.Name;
        Description = postDto.Description;
        Questions = postDto.Questions;
        Interviews = Array.Empty<string>();
    }
}