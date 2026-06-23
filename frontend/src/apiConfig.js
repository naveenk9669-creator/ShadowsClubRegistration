const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";

export const API_PATH = (path) => `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

export const getPhotoUrl = (photo) => {
  if (!photo) return "";
  if (photo.startsWith("http") || photo.startsWith("blob:")) return photo;
  return `${API_BASE_URL}/${photo.replace(/\\/g, "/")}`;
};
