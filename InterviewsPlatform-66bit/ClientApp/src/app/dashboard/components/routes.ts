export interface IRoute {
  title: string;
  path: string;
  side: boolean;
}

export const mainRoutes: IRoute[] = [
  {title: 'Вакансии', path: '/dashboard/vacancies', side: true},
  {title: 'Кандидаты', path: '/dashboard/candidates', side: true},
  {title: '+ Вакансия', path: '/dashboard/vacancy/create', side: false},
  {title: '+ HR аккаунт', path: '/dashboard/hr/create', side: false},
  {title: '+ Кандидат', path: '/dashboard/candidate/create', side: false}
];

export const vacancyRoutes = (id: string): IRoute[] => ([
  {title: 'Основная информация', path: '/dashboard/vacancy/' + id + '/main', side: true},
  {title: 'Интервью', path: '/dashboard/vacancy/' + id + '/interviews', side: true},
]);

export const interviewRoutes = (id: string): IRoute[] => ([
  {title: 'Просмотр', path: '/dashboard/interview/' + id + '/main', side: true},
  {title: 'Настройки', path: '/dashboard/interview/' + id + '/settings', side: true},
])
