using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InterviewsPlatform_66bit.DTO;

public class InterviewDTO
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string IntervieweeId { get; set; }
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string VideoId { get; set; }
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string ScreenVideoId { get; set; }
}