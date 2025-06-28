import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// ------------------- USERS -------------------

export const signupUser = (userData) => API.post("/users", userData);
export const loginUser = (credentials) => API.post("/users/login", credentials);

// ------------------- GOALS -------------------

export const createGoal = (goalData) => API.post("/goals", goalData);
export const getGoals = (userId) => API.get(`/goals?userId=${userId}`);

// ------------------- TASKS -------------------

export const createTask = (taskData) => API.post("/tasks", taskData);
export const getTasksByGoal = (goalId) => API.get(`/tasks?goalId=${goalId}`);
export const updateTask = (taskId, updates) => API.patch(`/tasks/${taskId}`, updates);
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);
export async function googleLoginUser(googleUserData) {
  const response = await fetch(`${API_BASE_URL}/users/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googleUserData),
  });
  return response.json();
}
