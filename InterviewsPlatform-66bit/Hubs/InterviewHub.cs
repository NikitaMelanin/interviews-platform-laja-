using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver.GridFS;

namespace InterviewsPlatform_66bit.Hubs;

public class InterviewHub : Hub
{
    private readonly IGridFSBucket bucket;

    public InterviewHub(IGridFSBucket bucket)
    {
        this.bucket = bucket;
    }

    private static GridFSUploadStream stream;

    public void AddBytes(string interviewId, string base64Bytes)
    {
        var bytes = Convert.FromBase64String(base64Bytes);
        stream.Write(bytes);
    }

    public override Task OnConnectedAsync()
    {
        stream = bucket.OpenUploadStream("interview");
        Clients.Caller.SendCoreAsync("setFileId", new[] {stream.Id.ToString()});
        return base.OnConnectedAsync();
    }

    // private static void Render()
    // {
    //     var videoBytes = Video.Bytes.ToArray();
    //     using var fs = new FileStream(@"C:\Users\jexin\Desktop\video.mkv", FileMode.Create, FileAccess.Write);
    //     fs.Write(videoBytes, 0, videoBytes.Length);
    // }
    //
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        // Render();
        stream.CloseAsync();
        return base.OnDisconnectedAsync(exception);
    }
}