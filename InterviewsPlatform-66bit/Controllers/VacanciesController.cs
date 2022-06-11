using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Controllers;

[Authorize]
[Route("/vacancies")]
public class VacanciesController : Controller
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;
    private readonly IMongoCollection<VacancyDTO> collection;

    public VacanciesController(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;
        
        collection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");
    }

    [HttpPost]
    [Route("{id}/generateLink")]
    [Produces("application/json")]
    public async Task<IActionResult> GenerateLink(string id) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var guid = Guid.NewGuid();
            var update = Builders<VacancyDTO>.Update
                .Set(v => v.PassLink, guid.ToString());

            var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);
            
            var vacancy = (await collection.FindAsync(filter)).Single();

            if (vacancy.CreatorId != User.Identity!.Name!)
            {
                return Forbid();
            }

            await collection.UpdateOneAsync(filter, update);

            return Ok(guid);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpPost]
    [Produces("application/json")]
    public async Task<IActionResult> Create([FromBody] VacancyPostDTO postDto)
    {
        var creatorId = User.Identity!.Name;

        var vacancy = new VacancyDTO(postDto) { CreatorId = creatorId! };

        await collection.InsertOneAsync(vacancy);

        return Created($"/vacancies/{vacancy.Id}", vacancy);
    }

    [HttpPatch]
    [Route("{id}")]
    [Produces("application/json")]
    public async Task<IActionResult> Update(string id, [FromBody] VacancyPostDTO postDto) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var update = Builders<VacancyDTO>.Update
                .Set(v => v.Name, postDto.Name)
                .Set(v => v.Description, postDto.Description)
                .Set(v => v.Questions, postDto.Questions);

            var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);
            
            var vacancy = (await collection.FindAsync(filter)).Single();

            if (vacancy.CreatorId != User.Identity!.Name!)
            {
                return Forbid();
            }

            await collection.UpdateOneAsync(filter, update);

            return Ok(vacancy);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpGet]
    [Route("{id}")]
    [Produces("application/json")]
    public async Task<IActionResult> Read(string id) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);

            var vacancy = (await collection.FindAsync(filter)).Single();

            return Ok(vacancy);
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> Delete(string id) =>
        await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);
            
            var vacancy = (await collection.FindAsync(filter)).Single();

            if (vacancy.CreatorId != User.Identity!.Name!)
            {
                return Forbid();
            }

            var interviewsCollection = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");
            
            var builder = Builders<InterviewDTO>.Filter;
            var deleteFilter = vacancy.Interviews.Aggregate(
                builder.Empty,
                (current, interviewId) => current & builder.Eq(i => i.Id, interviewId));

            await interviewsCollection.DeleteManyAsync(deleteFilter);

            await collection.DeleteOneAsync(filter);

            return NoContent();
        }, BadRequest(), NotFound(new {errorText = "Bad id"}));

    // [HttpGet]
    // [Route("{passLink}/questions")]
    // [Produces("application/json")]
    // public async Task<IActionResult> Questions(string passLink)
    //     => await DbExceptionsHandler.HandleAsync(async () =>
    //     {
    //         var filter = Builders<VacancyDTO>.Filter.Eq(v => v.PassLink, passLink);
    //
    //         var vacancy = (await collection.FindAsync(filter)).Single();
    //
    //         return Ok(vacancy.Questions);
    //     }, BadRequest(), NotFound(new {errorText = "Bad pass link"}));
}