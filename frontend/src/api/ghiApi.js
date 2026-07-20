const API_URL = import.meta.env.VITE_API_URL;
export async function getGHIData() {
  const response = await fetch(`${API_URL}/data`);
  const data = await response.json();

  console.log("API Response:", data);
  console.log("Is Array?", Array.isArray(data));
  return data;
}