using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InterviewsPlatform_66bit.DTO;

public class VideoDTO
{
    public string Id { get; set; }

    public byte[] Bytes { get; set; }
}