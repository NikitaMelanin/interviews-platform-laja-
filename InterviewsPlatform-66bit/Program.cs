using Autofac;
using Autofac.Extensions.DependencyInjection;
using InterviewsPlatform_66bit.Hubs;
using InterviewsPlatform_66bit.Utils;

var builder = WebApplication.CreateBuilder(args);

builder.Host
    .UseServiceProviderFactory(new AutofacServiceProviderFactory())
    .ConfigureContainer<ContainerBuilder>(builder =>
    {
        builder.RegisterModule(new BasicRegModule());
    })
    .ConfigureServices(services =>
    {
        services.AddSignalR(o =>
        {
            o.EnableDetailedErrors = true;
            o.MaximumReceiveMessageSize = null;
        });
        services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
        {
            builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithOrigins("https://localhost:44423");
        }));
        services.AddControllersWithViews();
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