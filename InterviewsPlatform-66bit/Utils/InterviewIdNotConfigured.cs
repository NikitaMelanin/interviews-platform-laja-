namespace InterviewsPlatform_66bit.Utils;

public class InterviewIdNotConfigured : Exception
{
    public InterviewIdNotConfigured():
        base("Interview id not configured call StartUploading hub method with interview id") { }
}