export const convertToDay = (time: number | Date | string) => {
  const date = new Date(time);
  return `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
};

export const dayToDate = (day: string) => {
  const [y1, y2, y3, y4, m1, m2, d1, d2] = day;
  return new Date(`${y1}${y2}${y3}${y4}-${m1}${m2}-${d1}${d2}`);
};