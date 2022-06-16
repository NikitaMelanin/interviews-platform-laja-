export interface IRoute {
  title: string;
  path: string;
  side: boolean;
  roles?: string[];
}

export const mainRoutes: IRoute[] = [
  {title: 'Вакансии', path: '/dashboard/vacancies', side: true, roles: ['Hr', 'Administrator']},
  {title: 'Кандидаты', path: '/dashboard/candidates', side: true, roles: ['Hr', 'Administrator']},
  {title: '+ Вакансия', path: '/dashboard/vacancy/create', side: false, roles: ['Hr', 'Administrator']},
  {title: '+ HR аккаунт', path: '/dashboard/hr/create', side: false, roles: ['Administrator']},
];

export const vacancyRoutes = (id: string): IRoute[] => ([
  {title: 'Основная информация', path: '/dashboard/vacancy/' + id + '/main', side: true, roles: ['Hr', 'Administrator']},
  {title: 'Интервью', path: '/dashboard/vacancy/' + id + '/interviews', side: true, roles: ['Hr', 'Administrator']},
]);

export const interviewRoutes = (id: string): IRoute[] => ([
  {title: 'Просмотр', path: '/dashboard/interview/' + id + '/main', side: true, roles: ['Hr', 'Administrator']},
  {title: 'Настройки', path: '/dashboard/interview/' + id + '/settings', side: true, roles: ['Hr', 'Administrator']},
])
