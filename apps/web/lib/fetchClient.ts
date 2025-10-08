export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchClient = async (url: string, options: RequestInit) => {
  const response = await fetch(API_URL + url, options);
  return response.json();
};