export interface IVacancy {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  passLink: string;
  questions: string[];
  interviews: string[];
}

export interface ICandidate {
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  email: string;
}

export interface IInterview {
  id: string;
  intervieweeId: string;
  timeStops: string[];
  videoId: string;
  passLink: string;
  screenVideoId: string;
}
