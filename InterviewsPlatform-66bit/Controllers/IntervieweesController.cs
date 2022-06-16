using InterviewsPlatform_66bit.DB;
using InterviewsPlatform_66bit.DTO;
using InterviewsPlatform_66bit.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace InterviewsPlatform_66bit.Controllers;


[Authorize(Roles = $"{Roles.ADMINISTRATOR},{Roles.HR}")]
[Route("/interviewees")]
public class IntervieweesController: Controller
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;
    private readonly IMongoCollection<IntervieweeDTO> collection;

    public IntervieweesController(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;

        collection = dbResolver.GetMongoCollection<IntervieweeDTO>(dbName, "interviewees");
    }

    [HttpGet]
    [Produces("application/json")]
    public async Task<IActionResult> AllInterviewees()
        => await DbExceptionsHandler.HandleAsync(async () =>
        {
            var documents = await collection.FindAsync(_ => true);

            return Ok(await documents.ToListAsync());
        }, BadRequest(), NotFound());
}