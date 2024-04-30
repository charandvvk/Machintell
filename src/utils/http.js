import { QueryClient } from "@tanstack/react-query";

const hostName = "http://localhost:4004/api/v1";

export const queryClient = new QueryClient();

export const sendData = async (route, method, requestData) => {
    const response = await fetch(hostName + route, {
        method,
        body: JSON.stringify(requestData),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok)
        throw new Error(
            `Failed to ${method === "POST" ? "add" : "update"} data`
        );
    const { message, data } = await response.json();
    return { message, data };
};

export const getData = async (route) => {
    const response = await fetch(hostName + route);
    if (!response.ok) throw new Error("Failed to get data");
    const data = await response.json();
    return data;
};

export const deleteData = async (route) => {
    const response = await fetch(hostName + route, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    const { message, data } = await response.json();
    return { message, data };
};
