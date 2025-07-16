import axios from "axios";
import qs from "qs";

export const api = axios.create({
    baseURL: "http://localhost:4000",

    paramsSerializer: (params) =>
        qs.stringify(params, {
            arrayFormat: "repeat",
            skipNulls: true,
            encode: false,
        }),
});
