using Microsoft.AspNetCore.Mvc;

namespace InterviewsPlatform_66bit.Utils;

public class DbExceptionsHandler
{
    public static async Task<IActionResult> HandleAsync(Func<Task<IActionResult>> handling,
        IActionResult badRequest, IActionResult notFound)
    {
        try
        {
            return await handling();
        }
        catch (Exception ex) when (ex is FormatException or IndexOutOfRangeException)
        {
            return badRequest;
        }
        catch (InvalidOperationException)
        {
            return notFound;
        }
    }
}