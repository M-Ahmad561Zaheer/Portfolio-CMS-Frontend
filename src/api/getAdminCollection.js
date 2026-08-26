import api from "./api";

export default async function getAdminCollection(resource) {
  try {
    const response = await api.get(`/${resource}/admin`);
    return { data: response.data, compatibilityMode: false };
  } catch (error) {
    const status = error.response?.status;

    if (status !== 404 && status !== 405) {
      throw error;
    }

    const response = await api.get(`/${resource}`);
    return { data: response.data, compatibilityMode: true };
  }
}
