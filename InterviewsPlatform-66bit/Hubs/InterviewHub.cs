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

    public async void AddBytes(string base64Bytes)
    {
        var bytes = Convert.FromBase64String(base64Bytes);
        await ((GridFSUploadStream) Context.Items["stream"]!).WriteAsync(bytes);
    }

    public override Task OnConnectedAsync()
    {
        var bucket = dbResolver.GetGridFsBucket(dbName);
        Context.Items["stream"] = bucket.OpenUploadStream("interview");
        return base.OnConnectedAsync();
    }
    
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        ((GridFSUploadStream) Context.Items["stream"]!).CloseAsync();
        return base.OnDisconnectedAsync(exception);
    }
}