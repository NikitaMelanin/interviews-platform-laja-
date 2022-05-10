using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace InterviewsPlatform_66bit.DTO;

public class InterviewDTO
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string InterviewVideoId { get; set; }
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string InterviewScreenVideoId { get; set; }
}