using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Hubs;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;

var builder = WebApplication.CreateBuilder(args);

var client = new MongoClient("mongodb://localhost:27017/");
var database = client.GetDatabase("InterviewsPortal");
var bucket = new GridFSBucket(database);

builder.Services.AddSingleton<IGridFSBucket>(_ => bucket);

// Add services to the container.
builder.Services.AddSignalR(o => o.EnableDetailedErrors = true);

builder.Services.AddCors(o => o.AddPolicy("CorsPolicy", builder => {  
    builder  
        .AllowAnyMethod()  
        .AllowAnyHeader()  
        .AllowCredentials()  
        .WithOrigins("https://localhost:44423");  
})); 

builder.Services.AddControllersWithViews();
builder.Services.Configure<HubOptions>(options =>
{
    options.MaximumReceiveMessageSize = null;
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllers();
app.MapHub<InterviewHub>("/interviews/hub");

app.UseCors("CorsPolicy");

app.MapFallbackToFile("index.html");

app.Run();