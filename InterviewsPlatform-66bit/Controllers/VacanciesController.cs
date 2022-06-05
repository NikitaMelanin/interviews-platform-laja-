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

    public VacanciesController(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;
    }

    [HttpPost]
    [Produces("application/json")]
    public async Task<IActionResult> Create([FromBody] VacancyPostDTO postDto)
    {
        var collection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");

        var vacancy = new VacancyDTO(postDto);

        await collection.InsertOneAsync(vacancy);

        Response.Headers.Location = $"/vacancies/{vacancy.Id}";
        
        return Ok();
    }

    [HttpPatch]
    [Route("{id}")]
    [Produces("application/json")]
    public async Task<IActionResult> Update(string id, [FromBody] VacancyPostDTO postDto)
    {
        var collection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");

        var update = Builders<VacancyDTO>.Update
            .Set(v => v.Name, postDto.Name)
            .Set(v => v.Description, postDto.Description)
            .Set(v => v.Questions, postDto.Questions);

        var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);

        var res = await collection.UpdateOneAsync(filter, update);

        if (!res.IsAcknowledged || !res.IsModifiedCountAvailable)
        {
            return NotFound(new {errorText = "Bad id"});
        }
        
        Response.Headers.Location = $"/vacancies/{id}";

        return Ok();
    }

    [HttpGet]
    [Route("{id}")]
    [Produces("application/json")]
    public async Task<IActionResult> Read(string id)
    {
        var collection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");

        return await DbExceptionsHandler.HandleAsync(async () =>
        {
            var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);

            var vacancy = (await collection.FindAsync(filter)).Single();

            return Ok(vacancy);
        }, BadRequest(), NotFound());
    }
}