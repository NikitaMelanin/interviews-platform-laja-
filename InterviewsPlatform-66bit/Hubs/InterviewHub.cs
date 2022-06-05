using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace InterviewsPlatform_66bit.Hubs;

public class InterviewHub : Hub
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;

    public InterviewHub(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;
    }

    public async void StartDownloadingVideo(string interviewId)
    {
        var interviews = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");

        var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, interviewId);

        var interview = (await interviews.FindAsync(filter)).SingleOrDefault();

        if (interview is null)
        {
            throw new Exception("Interview not found");
        }

        var bucket = dbResolver.GetGridFsBucket(dbName);

        await using var stream = await bucket.OpenDownloadStreamAsync(ObjectId.Parse(interview.VideoId));

        while (stream.Position != stream.Length)
        {
            await Clients.Caller.SendCoreAsync("setVideoBytes",
                new object?[] {stream.ReadByte()});
        }

        await stream.CloseAsync();
    }
    
    public async void StartDownloadingScreenVideo(string interviewId)
    {
        var interviews = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");

        var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, interviewId);

        var interview = (await interviews.FindAsync(filter)).SingleOrDefault();

        if (interview is null)
        {
            throw new Exception("Interview not found");
        }

        var bucket = dbResolver.GetGridFsBucket(dbName);
        
        await using var stream = await bucket.OpenDownloadStreamAsync(ObjectId.Parse(interview.ScreenVideoId));

        while (stream.Position != stream.Length)
        {
            await Clients.Caller.SendCoreAsync("setScreenVideoBytes",
                new object?[] {stream.ReadByte()});
        }

        await stream.CloseAsync();
    }

    public async void AddVideoBytes(string base64Bytes)
    {
        var bytes = Convert.FromBase64String(base64Bytes);
        await ((GridFSUploadStream) Context.Items["videoStream"]!).WriteAsync(bytes);
    }

    public async void AddScreenVideoBytes(string base64Bytes)
    {
        var bytes = Convert.FromBase64String(base64Bytes);
        await ((GridFSUploadStream) Context.Items["screenVideoStream"]!).WriteAsync(bytes);
    }

    public async void AttachStreamsToInterview(string interviewId)
    {
        var collection = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");
        
        var videoStreamId = ((GridFSUploadStream) Context.Items["videoStream"]!).Id;
        var screenVideoStreamId = ((GridFSUploadStream) Context.Items["screenVideoStream"]!).Id;

        var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, interviewId);

        var update = Builders<InterviewDTO>.Update
            .Set(i => i.VideoId, videoStreamId.ToString())
            .Set(i => i.ScreenVideoId, screenVideoStreamId.ToString());

        await collection.UpdateOneAsync(filter, update);
    }

    public override Task OnConnectedAsync()
    {
        var bucket = dbResolver.GetGridFsBucket(dbName);
        var videoStream = bucket.OpenUploadStream("interviewVideo");
        var screenVideoStream = bucket.OpenUploadStream("interviewScreen");
        Context.Items["videoStream"] = videoStream;
        Context.Items["screenVideoStream"] = screenVideoStream;

        return base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await ((GridFSUploadStream) Context.Items["videoStream"]!).CloseAsync();
        await ((GridFSUploadStream) Context.Items["screenVideoStream"]!).CloseAsync();

        await base.OnDisconnectedAsync(exception);
    }
}