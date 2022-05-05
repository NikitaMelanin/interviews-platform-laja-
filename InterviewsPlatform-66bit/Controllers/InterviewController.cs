using InterviewsPlatform_66bit.DB;
using Microsoft.AspNetCore.Mvc;

namespace InterviewsPlatform_66bit.Controllers;

[Route("/interview")]
public class InterviewController: Controller
{
    private readonly IDBResolver dbResolver;
    private readonly string dbName;

    public InterviewController(IDBResolver dbResolver, string dbName)
    {
        this.dbResolver = dbResolver;
        this.dbName = dbName;
    }

    [HttpGet]
    [Produces("text/plain")]
    public IActionResult CreateInterview()
    {
        return Ok("works");
    }
}