using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Utils;
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

    public async void AddBytes(string base64Bytes)
    {
        var interviewId = (string?) Context.Items["interview-id"];
        
        if (interviewId is null)
        {
            throw new InterviewIdNotConfigured();
        }
        
        var bytes = Convert.FromBase64String(base64Bytes);
        await ((GridFSUploadStream) Context.Items["stream"]!).WriteAsync(bytes);
    }

    public async Task<IEnumerable<string>> GetQuestions()
    {
        var interviewId = (string?) Context.Items["interview-id"];

        if (interviewId is null)
        {
            throw new InterviewIdNotConfigured();
        }
        
        var filter = Builders<InterviewDTO>.Filter.Where(i => i.Id == ObjectId.Parse(interviewId));
        return (await dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews").FindAsync(filter)).Single().Questions;
    }

    public async void StartUploading(string interviewId)
    {
        Context.Items["interview-id"] = interviewId;
        var filter = Builders<InterviewDTO>.Filter.Where(i => i.Id == ObjectId.Parse(interviewId));
        var collection = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");
        var videoId = ((GridFSUploadStream) Context.Items["stream"]!).Id;
        var update = Builders<InterviewDTO>.Update.Set(i => i.InterviewVideoId, videoId);
        await collection.UpdateOneAsync(filter, update);
    }
    
    public override Task OnConnectedAsync()
    {
        var bucket = dbResolver.GetGridFsBucket(dbName);
        var stream = bucket.OpenUploadStream("interview");
        Context.Items["stream"] = stream;

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        ((GridFSUploadStream) Context.Items["stream"]!).CloseAsync();
        return base.OnDisconnectedAsync(exception);
    }
}