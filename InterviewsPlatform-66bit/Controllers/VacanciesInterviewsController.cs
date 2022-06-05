using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Controllers;

[Authorize]
[Route("/vacancies/{id}/interviews")]
public class VacanciesInterviewsController : Controller
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;

    public VacanciesInterviewsController(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;
    }
    
    [HttpPost]
    [Produces("application/json")]
    public async Task<IActionResult> AddInterview(string id, [FromBody] IntervieweePostDTO intervieweePost)
    {
        var vacanciesCollection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");
        var intervieweesCollection = dbResolver.GetMongoCollection<IntervieweeDTO>(dbName, "interviewees");
        var interviewsCollection = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");

        // return await DbExceptionsHandler.HandleAsync(async () =>
        {
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

            var vacancy = await vacanciesCollection.FindOneAndUpdateAsync(filterVacancy, updateVacancy);

            return Ok(vacancy.Interviews.Append(interview.Id));
            // }, BadRequest(), NotFound());
        }
    }

    private static async Task<IntervieweeDTO> FindAndUpdateOrInsertIntervieweeAsync(
        IMongoCollection<IntervieweeDTO> collection,
        IntervieweePostDTO intervieweePost)
    {
        var builder = Builders<IntervieweeDTO>.Filter;
        var filter =
            builder.Eq(u => u.Name, intervieweePost.Name) &
            builder.Eq(u => u.Surname, intervieweePost.Surname) &
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