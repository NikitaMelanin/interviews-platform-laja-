using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Controllers;

[Authorize(Roles = $"{Roles.ADMINISTRATOR},{Roles.HR}")]
[Route("/vacancies/{id}/interviews")]
public class VacanciesInterviewsController : Controller
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;
    private readonly IMongoCollection<VacancyDTO> vacanciesCollection;
    private readonly IMongoCollection<InterviewDTO> interviewsCollection;

    public VacanciesInterviewsController(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;
        
        vacanciesCollection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");
        interviewsCollection = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");
    }
    
    [HttpPost]
    [Produces("application/json")]
    public async Task<IActionResult> AddInterview(string id, [FromBody] IntervieweePostDTO intervieweePost) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var intervieweesCollection = dbResolver.GetMongoCollection<IntervieweeDTO>(dbName, "interviewees");
            
            var interviewee = await FindAndUpdateOrInsertIntervieweeAsync(intervieweesCollection, intervieweePost);

            var interview = new InterviewDTO
            {
                Id = ObjectId.GenerateNewId().ToString(),
                IntervieweeId = interviewee.Id
            };

            var filterVacancy = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);
            var updateVacancy = Builders<VacancyDTO>.Update.Push(v => v.Interviews, interview.Id);

            var filterInterviewee = Builders<IntervieweeDTO>.Filter.Eq(i => i.Id, interviewee.Id);
            var updateInterviewee = Builders<IntervieweeDTO>.Update.Push(i => i.Interviews, interview.Id);

            await interviewsCollection.InsertOneAsync(interview);
            await intervieweesCollection.UpdateOneAsync(filterInterviewee, updateInterviewee);

            await vacanciesCollection.UpdateOneAsync(filterVacancy, updateVacancy);

            return Ok(interview.Id);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [Produces("application/json")]
    public async Task<IActionResult> GetAllVacancyInterviews(string id)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);
            var vacancy = (await vacanciesCollection.FindAsync(filter)).Single();

            var interviews = new List<InterviewDTO>();

            foreach (var interviewId in vacancy.Interviews)
            {
                var interviewFilter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, interviewId);
                
                interviews.Add((await interviewsCollection.FindAsync(interviewFilter)).Single());
            }

            return Ok(interviews);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    private static async Task<IntervieweeDTO> FindAndUpdateOrInsertIntervieweeAsync(
        IMongoCollection<IntervieweeDTO> collection,
        IntervieweePostDTO intervieweePost)
    {
        var builder = Builders<IntervieweeDTO>.Filter;
        var filter =
            builder.Eq(u => u.Name, intervieweePost.Name) &
            builder.Eq(u => u.Surname, intervieweePost.Surname) &
            builder.Eq(u => u.Patronymic, intervieweePost.Patronymic) &
            (builder.Eq(u => u.Email, intervieweePost.Email) | builder.Eq(u => u.Phone, intervieweePost.Phone));

        var intervieweeDb = await collection.FindAsync(filter);
        var interviewee = new IntervieweeDTO(intervieweePost);

        var first = await intervieweeDb.FirstOrDefaultAsync();
        if (first is not null)
        {
            interviewee.Id = first.Id;
            await collection.ReplaceOneAsync(filter, interviewee);
        }
        else
        {
            await collection.InsertOneAsync(interviewee);
        }

        return interviewee;
    }
}