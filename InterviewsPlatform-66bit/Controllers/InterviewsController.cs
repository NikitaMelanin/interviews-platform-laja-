using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Controllers;

//[Authorize(Roles = $"{Roles.ADMINISTRATOR},{Roles.HR}")]
[Route("/interviews")]
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

    [HttpPost]
    [Route("{id}/generate-link")]
    [Produces("application/json")]
    public async Task<IActionResult> GenerateLink(string id) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var guid = Guid.NewGuid();
            var update = Builders<InterviewDTO>.Update
                .Set(v => v.PassLink, guid.ToString());

            var filter = Builders<InterviewDTO>.Filter.Eq(v => v.Id, id);

            await collection.UpdateOneAsync(filter, update);

            return Ok(guid);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpPatch]
    [AllowAnonymous]
    [Route("{passLink}/time-stops")]
    [Produces("application/json")]
    public async Task<IActionResult> AddTimeStops(string passLink, [FromBody] TimeStopDTO times) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.PassLink, passLink);
            var update = Builders<InterviewDTO>.Update.PushEach(i => i.TimeStops, times.TimeStops);

            await collection.FindOneAndUpdateAsync(filter, update);

            return Ok();
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpPatch]
    [AllowAnonymous]
    [Route("{passLink}/time-stops/reset")]
    [Produces("application/json")]
    public async Task<IActionResult> ResetTimeStops(string passLink, [FromBody] TimeStopDTO times) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.PassLink, passLink);
            var update = Builders<InterviewDTO>.Update.Set(i => i.TimeStops, new TimeStop[] { });

            await collection.FindOneAndUpdateAsync(filter, update);

            return Ok();
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [Route("{id}")]
    [Produces("application/json")]
    public async Task<IActionResult> Read(string id) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, id);

            var interview = (await collection.FindAsync(filter)).Single();

            return Ok(interview);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [AllowAnonymous]
    [Route("{passLink}/questions")]
    [Produces("application/json")]
    public async Task<IActionResult> Questions(string passLink)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var vacanciesCollection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");

            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.PassLink, passLink);

            var interview = (await collection.FindAsync(filter)).Single();

            var id = interview.Id;

            var filterVacancy = Builders<VacancyDTO>.Filter.AnyEq(v => v.Interviews, id);

            var vacancy = (await vacanciesCollection.FindAsync(filterVacancy)).Single();

            return Ok(vacancy.Questions);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [AllowAnonymous]
    [Route("{passLink}/description")]
    [Produces("application/json")]
    public async Task<IActionResult> Description(string passLink)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var vacanciesCollection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");

            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.PassLink, passLink);

            var interview = (await collection.FindAsync(filter)).Single();

            var id = interview.Id;

            var filterVacancy = Builders<VacancyDTO>.Filter.AnyEq(v => v.Interviews, id);

            var vacancy = (await vacanciesCollection.FindAsync(filterVacancy)).Single();

            return Ok(vacancy.Description);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    
    [HttpGet]
    [Route("{id}/video")]
    public async Task<IActionResult> Video(string id)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, id);

            var interview = (await collection.FindAsync(filter)).Single();

            var videoBytes = await dbResolver.GetGridFsBucket(dbName)
                .DownloadAsBytesAsync(ObjectId.Parse(interview.VideoId));

            return File(videoBytes, "application/octet-stream", true);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [Route("{id}/screen-video")]
    public async Task<IActionResult> ScreenVideo(string id)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, id);

            var interview = (await collection.FindAsync(filter)).Single();

            var videoBytes = await dbResolver.GetGridFsBucket(dbName)
                .DownloadAsBytesAsync(ObjectId.Parse(interview.ScreenVideoId));

            return File(videoBytes, "application/octet-stream", true);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [Route("{id}/interviewee")]
    public async Task<IActionResult> Interviewee(string id)
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<InterviewDTO>.Filter.Eq(i => i.Id, id);

            var interview = (await collection.FindAsync(filter)).Single();

            var intervieweesCollection = dbResolver.GetMongoCollection<IntervieweeDTO>(dbName, "interviwees");

            var intervieweeFilter = Builders<IntervieweeDTO>.Filter.Eq(i => i.Id, interview.IntervieweeId);

            var interviewee = (await intervieweesCollection.FindAsync(intervieweeFilter)).Single();

            return Ok(interviewee);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));
}