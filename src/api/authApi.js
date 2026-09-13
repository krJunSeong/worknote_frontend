import api from "./api";

export const login = (data) => {
    return api.post("/api/auth/login", data);
};

export const signup = (data, config = {}) => {
    return api.post("/api/auth/signup", data, config);
};