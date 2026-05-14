const API_URL = "http://localhost:5000/api/projects";

const getToken = () => localStorage.getItem("token");

const getHeaders = (isJson = false) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const getAllProjects = async () => {
  const res = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch projects");
  }

  return data;
};

export const getProjectById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch project");
  }

  return data;
};

export const createProject = async (projectData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(projectData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create project");
  }

  return data;
};

export const updateProject = async (id, projectData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(projectData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update project");
  }

  return data;
};

export const deleteProject = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete project");
  }

  return data;
};