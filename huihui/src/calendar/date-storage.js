export function fetchDate() {
  return JSON.parse(localStorage.getItem("date")) || {};
}
export function saveDate(date, state = false) {
  const d = fetchDate();
  d[date] = state;
  return localStorage.setItem("date", JSON.stringify(d));
}
