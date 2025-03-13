// api를 모아놓는 파일
export const API_URL = "https://your-api-url.com";

export const request = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${API_URL}${endpoint}`, options);
  return response.json();
};