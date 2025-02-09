export function buildPath(route) {
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.ganttify.xyz/' + route;
  } else {
    return 'http://localhost:5000/' + route;
  }
}
