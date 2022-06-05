using Microsoft.AspNetCore.Mvc;

namespace InterviewsPlatform_66bit.DTO;

public class TimeStopDTO
{
    [FromBody] public List<TimeStop> TimeStops { get; set; }
}

public class TimeStop
{
    [FromBody] public string Title { get; set; }
    [FromBody] public int Offset { get; set; }
}