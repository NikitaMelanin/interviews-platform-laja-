using InterviewsPlatform_66bit.DB;
using Microsoft.AspNetCore.SignalR;
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

    public override Task OnConnectedAsync()
    {
        var bucket = dbResolver.GetGridFsBucket(dbName);
        var videoStream = bucket.OpenUploadStream("interviewVideo");
        var screenVideoStream = bucket.OpenUploadStream("interviewScreen");
        Context.Items["videoStream"] = videoStream;
        Context.Items["screenVideoStream"] = screenVideoStream;

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        ((GridFSUploadStream) Context.Items["videoStream"]!).CloseAsync();
        ((GridFSUploadStream) Context.Items["screenVideoStream"]!).CloseAsync();
        return base.OnDisconnectedAsync(exception);
    }
}