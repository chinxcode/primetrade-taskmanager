import axios from "axios";

const API_BASE_URL = process.env.API_URL || "http://localhost:8000/api/v1";

class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem("refreshToken");
                        const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, { refreshToken });

                        const { accessToken } = response.data.data;
                        localStorage.setItem("accessToken", accessToken);

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        this.clearAuth();
                        window.location.href = "/login";
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    clearAuth() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

    // Generic HTTP methods
    get(url, config) {
        return this.client.get(url, config);
    }

    post(url, data, config) {
        return this.client.post(url, data, config);
    }

    patch(url, data, config) {
        return this.client.patch(url, data, config);
    }

    delete(url, config) {
        return this.client.delete(url, config);
    }
}

class AuthService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    register(data) {
        return this.api.post("/users/register", data);
    }

    login(data) {
        return this.api.post("/users/login", data);
    }

    logout() {
        return this.api.post("/users/logout");
    }

    getCurrentUser() {
        return this.api.get("/users/profile");
    }

    updateProfile(data) {
        return this.api.patch("/users/profile", data);
    }

    changePassword(data) {
        return this.api.post("/users/change-password", data);
    }
}

class TaskService {
    constructor(apiClient) {
        this.api = apiClient;
    }

    getTasks(params) {
        return this.api.get("/tasks", { params });
    }

    getTaskById(id) {
        return this.api.get(`/tasks/${id}`);
    }

    createTask(data) {
        return this.api.post("/tasks", data);
    }

    updateTask(id, data) {
        return this.api.patch(`/tasks/${id}`, data);
    }

    deleteTask(id) {
        return this.api.delete(`/tasks/${id}`);
    }

    getTaskStats() {
        return this.api.get("/tasks/stats");
    }
}

// Create singleton instances
const apiClient = new ApiClient();
export const authAPI = new AuthService(apiClient);
export const tasksAPI = new TaskService(apiClient);

export default apiClient;
