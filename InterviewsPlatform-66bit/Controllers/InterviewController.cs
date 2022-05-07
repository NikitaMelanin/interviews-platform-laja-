using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace InterviewsPlatform_66bit.Controllers;

[Route("/interviews")]
public class InterviewController: Controller
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;

    public InterviewController(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;
    }

    [HttpPost]
    [Produces("text/plain")]
    public async Task<IActionResult> CreateInterview([FromBody] string[] questions)
    {
        var collection = dbResolver.GetMongoCollection<InterviewDTO>(dbName, "interviews");
        var id = ObjectId.GenerateNewId();
        var interview = new InterviewDTO {Id = id, Questions = questions};
        await collection.InsertOneAsync(interview);
        return Ok(id);
    }
}