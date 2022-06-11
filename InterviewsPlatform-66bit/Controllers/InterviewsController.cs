using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Controllers;

[Authorize]
[Route("/interviews/{id}")]
public class InterviewsController : Controller
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;
    private readonly IMongoCollection<InterviewDTO> collection;

    public InterviewsController(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;

        collection = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");
    }

    [HttpPatch]
    [Route("time-stops")]
    [Produces("application/json")]
    public async Task<IActionResult> AddTimeStops(string id, [FromBody] TimeStopDTO times) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, id);
            var update = Builders<InterviewDTO>.Update.PushEach(i => i.TimeStops, times.TimeStops);

            var updateRes = await collection.FindOneAndUpdateAsync(filter, update);

            return Ok(updateRes.TimeStops.Concat(times.TimeStops));
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [Produces("application/json")]
    public async Task<IActionResult> Read(string id) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, id);

            var interview = (await collection.FindAsync(filter)).Single();

            return Ok(interview);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [Route("questions")]
    [Produces("application/json")]
    public async Task<IActionResult> Questions(string id)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var vacanciesCollection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");

            var filter = Builders<VacancyDTO>.Filter.AnyEq(v => v.Interviews, id);

            var vacancy = (await vacanciesCollection.FindAsync(filter)).Single();

            return Ok(vacancy.Questions);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [Route("video")]
    public async Task<IActionResult> Video(string id)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, id);

            var interview = (await collection.FindAsync(filter)).Single();

            var videoBytes = await dbResolver.GetGridFsBucket(dbName)
                .DownloadAsBytesAsync(ObjectId.Parse(interview.VideoId));

            return File(videoBytes, "application/octet-stream", enableRangeProcessing: true);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));
}