const service = {};

const defaultToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJZZXNpY2EiLCJsYXN0TmFtZSI6IkxvcGV6IiwiZnVsbE5hbWUiOiJZZXNpY2EgTiBMb3BleiIsImVtYWlsIjoieWVzaWxvcEBhci5pYm0uY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaXNTdWJzY3JpYmVyIjp0cnVlLCJ1aWQiOiIwNjAyNzQ2MTMiLCJpYXQiOjE1OTA1MjA4MDB9.L_hA0ZctpzZRKFe2uOEqwytW1ZXDKopYEw13OYXYj4g";

service.setToken = (token) => {
  localStorage.setItem("token", token || defaultToken);
};

service.getToken = () => localStorage.getItem("token");

service.getUser = () => {
  const token = service.getToken();
  const user = JSON.parse(window.atob(token.split(".")[1]));
  console.log(user);
  return user;
};

export default service;