import axios from "axios";

export const Port = "http://localhost:5001";

export const API = axios.create({
    baseURL: "http://vinways.herokuapp.com/api/v1",
});

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common["Authorization"];
    }
};
