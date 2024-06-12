import { QueryClient } from "@tanstack/react-query";

const hostName = "http://localhost:8080/api/v1/";

export const queryClient = new QueryClient();

export const sendData = async (route, method, requestData) => {
    try {
        let response, responseData;
        try {
            response = await fetch(hostName + route, {
                method,
                body: JSON.stringify(requestData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            responseData = await response.json();
        } catch (error) {
            throw new Error();
        }
        if (!response.ok) {
            throw new Error(responseData);
        }
        return responseData;
    } catch (error) {
        throw new Error(
            `Failed to ${method === "POST" ? "save" : "update"}${
                error.message && ` (${error.message})`
            }.`
        );
    }
};

export const getData = async (route) => {
    try {
        let response, responseData;
        try {
            response = await fetch(hostName + route);
            responseData = await response.json();
        } catch (error) {
            throw new Error();
        }
        if (!response.ok) {
            throw new Error(responseData);
        }
        return responseData;
    } catch (error) {
        throw new Error(
            `Failed to fetch${error.message && ` (${error.message})`}.`
        );
    }
};

export const deleteData = async (route) => {
    try {
        let response, responseData;
        try {
            response = await fetch(hostName + route, {
                method: "DELETE",
            });
            responseData = await response.json();
        } catch (error) {
            throw new Error();
        }
        if (!response.ok) {
            throw new Error(responseData);
        }
        return responseData;
    } catch (error) {
        throw new Error(
            `Failed to delete${error.message && ` (${error.message})`}.`
        );
    }
};
