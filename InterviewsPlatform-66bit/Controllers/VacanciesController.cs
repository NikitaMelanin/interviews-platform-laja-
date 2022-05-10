using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Controllers;
// TODO: add error handler
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

    [HttpGet]
    [Route("{id}")]
    [Produces("application/json")]
    public async Task<IActionResult> Read(string id)
    {
        var collection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");

        VacancyDTO vacancy;
        try
        {
            var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);

            vacancy = (await collection.FindAsync(filter)).Single();
        }
        catch (Exception ex) when (ex is FormatException or IndexOutOfRangeException)
        {
            return BadRequest();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }

        return Ok(vacancy);
    }

    [HttpPatch]
    [Route("{id}/interviews")]
    [Produces("application/json")]
    public async Task<IActionResult> AddInterview(string id, [FromBody] string interviewId)
    {
        var collection = dbResolver.GetMongoCollection<VacancyDTO>(dbName, "vacancies");
        
        VacancyDTO vacancy;
        try
        {
            var filter = Builders<VacancyDTO>.Filter.Eq(v => v.Id, id);

            var update = Builders<VacancyDTO>.Update.Push(v => v.Interviews, interviewId);

            vacancy = await collection.FindOneAndUpdateAsync(filter, update);
        }
        catch (Exception ex) when (ex is FormatException or IndexOutOfRangeException)
        {
            return BadRequest();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }

        return Ok(vacancy.Interviews.Append(interviewId));
    }
}