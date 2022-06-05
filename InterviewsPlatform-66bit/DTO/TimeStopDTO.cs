namespace InterviewsPlatform_66bit.DTO;

public class TimeStopDTO
{
    public TimeStop[] TimeStops { get; set; }
}

public record TimeStop(string Title, int Offset);