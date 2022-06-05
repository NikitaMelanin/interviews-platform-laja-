namespace InterviewsPlatform_66bit.DTO;

public class TimeStopDTO
{
    public List<TimeStop> TimeStops { get; set; }
}

public record TimeStop(string Title, int Offset);