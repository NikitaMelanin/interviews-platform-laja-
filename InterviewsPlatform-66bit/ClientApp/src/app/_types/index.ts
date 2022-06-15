export interface IVacancy {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  passLink: string;
  questions: string[];
  interviews: string[];
}
