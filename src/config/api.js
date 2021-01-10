import axios from "axios";

export const Port = "http://vinways.herokuapp.com";

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
