export const startInterview = (passLink: string) => ({
  generated: '/interview/' + passLink + '/info',
  default: ':passLink/info'
})
