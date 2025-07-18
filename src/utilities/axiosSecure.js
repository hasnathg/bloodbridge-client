import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

// Interceptor to attach fresh Firebase token
axiosSecure.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosSecure;
