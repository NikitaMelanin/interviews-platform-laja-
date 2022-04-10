using InterviewsPlatform_66bit.DTO;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Hubs;

public class InterviewHub : Hub
{
    // private IMongoCollection<VideoDTO> videosCollection;
    
    // public InterviewHub(IMongoCollection<VideoDTO> videosCollection)
    // {
    //     this.videosCollection = videosCollection;
    // }

    private static readonly VideoDTO Video = new () {Bytes = new ()};
    
    public void AddBytes(string base64Bytes)
    {
        // var update = new BsonDocument("$concat", base64Bytes);
        //
        // await videosCollection.FindOneAndUpdateAsync(doc => doc.Id == interviewId, update);

        Video.Bytes.AddRange(Convert.FromBase64String(base64Bytes));
    }

    private static void Render()
    {
        var videoBytes = Video.Bytes.ToArray();
        using var fs = new FileStream(@"C:\Users\jexin\Desktop\video.mkv", FileMode.Create, FileAccess.Write);
        fs.Write(videoBytes, 0, videoBytes.Length);
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Render();
        return base.OnDisconnectedAsync(exception);
    }
}