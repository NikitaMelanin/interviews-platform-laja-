using Autofac;
using InterviewsPlatform_66bit.Controllers;
using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.Hubs;
using InterviewsPlatform_66bit.Services;

namespace InterviewsPlatform_66bit.Utils;

public class BasicRegModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<InterviewHub>().ExternallyOwned()
            .WithParameter("dbName", "InterviewsPortal");
        
        builder.RegisterType<DBResolver>().As<IDBResolver>()
            .WithParameter("mongoConnectionString", "mongodb://localhost:27017/")
            .SingleInstance();

        // builder.RegisterType<InterviewController>().ExternallyOwned()
        //     .WithParameter("dbName", "InterviewsPortal");
        
        builder.RegisterType<VacanciesController>().ExternallyOwned()
            .WithParameter("dbName", "InterviewsPortal");

        builder.RegisterType<AccountController>().ExternallyOwned();

        builder.RegisterType<JwtIdentifier>().As<IIdentifier>()
            .WithParameter("dbName", "InterviewsPortal");

        builder.RegisterType<VacanciesInterviewsController>().ExternallyOwned()
            .WithParameter("dbName", "InterviewsPortal");
    }
}