

export default function padNumber(num) {
  const timePadding = new Array(9 - `${num}`.length).join(' ');
  return `${timePadding}${num}`;
}