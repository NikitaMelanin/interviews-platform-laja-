using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InterviewsPlatform_66bit.DTO;

public class InterviewDTO
{
    [BsonId]
    public ObjectId Id { get; set; }

    public string[] Questions { get; set; }
    
    public ObjectId InterviewVideoId { get; set; }
}