import { useState } from "react";
import { getService, postService, putService, deleteService } from "../services/PetService";
import { useQuery } from "@tanstack/react-query";

const safeJson = async (response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

export function usePost() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const execute  = async (endpoint, formData) => {
        try {
            setData(null);
            setLoading(true);
            setError("");
            setIsSuccess(false);

            const response = await postService(endpoint, formData);

            if (!response.ok) {

                let message = "Request failed.";

                const errorData = await safeJson(response);

                if (response.status === 422) {
                    message = errorData?.errors
                        ? Object.values(errorData.errors)?.[0][0]
                        : errorData?.message;
                } 
                // Unauthorized
                else if (response.status === 401) {
                    message = errorData?.message || "Unauthorized. Please login again.";
                } 
                // Forbidden
                else if (response.status === 403) {
                    message = errorData?.message || "You do not have permission.";
                } 
                // Not found
                else if (response.status === 404) {
                    message = errorData?.message || "Resource not found.";
                } 
                else if (response.status === 409) {
                    message = errorData?.message || "Conflict.";
                } 
                // Server error
                else if (response.status === 500) {
                    message = "Server error. Please try again later.";
                } 
                // Other errors with message
                else {
                    message = errorData?.message || `Request failed with status ${response.status}`;
                }

                setError(message);
                return null;
            }

            const result = await response.json();
            setData(result);
            setIsSuccess(true);

            return result.data;
            
        } catch (error) {  
            if (error instanceof TypeError) {
                if (!navigator.onLine) {
                    setError("No internet connection.");
                } else {
                    setError("An error occurred. Please check your connection or try again later.");
                }
            } else {
                setError(error.message);
            }

            return null;

        } finally{
            setLoading(false);
        }
    }

    return { data, loading, error, isSuccess, execute };
}

export function usePut(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    
    const execute  = async (endpoint, rawFormData) => {
        try {
            setData(null);
            setLoading(true);
            setError("");
            setIsSuccess(false);

            const formData = new FormData();

            Object.entries(rawFormData).forEach(([key, value]) =>(
                formData.append(key, value)
            ))

            formData.append("_method", "PUT");

            const response = await putService(endpoint, formData);

            if (!response.ok) {

                let message = "Request failed.";

                const errorData = await safeJson(response);

                if (response.status === 422) {
                    message = errorData?.errors
                        ? Object.values(errorData.errors)?.[0][0]
                        : errorData?.message;
                } 
                // Unauthorized
                else if (response.status === 401) {
                    message = errorData?.message || "Unauthorized. Please login again.";
                } 
                // Forbidden
                else if (response.status === 403) {
                    message = errorData?.message || "You do not have permission.";
                } 
                // Not found
                else if (response.status === 404) {
                    message = errorData?.message || "Resource not found.";
                } 
                else if (response.status === 409) {
                    message = errorData?.message || "Have conflict with your inputs..";
                } 
                // Server error
                else if (response.status === 500) {
                    message = "Server error. Please try again later.";
                } 
                // Other errors with message
                else {
                    message = errorData?.message || `Request failed with status ${response.status}`;
                }

                setError(message);
                return null;
            }

            const result = await response.json();
            setData(result);
            setIsSuccess(true);
            return result;
            
        } catch (error) {  
            if (error instanceof TypeError) {
                if (!navigator.onLine) {
                    setError("No internet connection.");
                } else {
                    setError("An error occurred. Please check your connection or try again later.");
                }
            } else {
                setError(error.message);
            }

            setIsSuccess(false);
            return null;

        } finally{
            setLoading(false);
        }
    }

    return { data, loading, error, isSuccess, execute };
}

export function useGet(endpoint) {
    return useQuery({
        queryKey: [endpoint],
        queryFn: () => getService(endpoint),
        retry: false,
        refetchOnWindowFocus: false
    });
}

export function useGetMsg(endpoint) {
    return useQuery({
        queryKey: [endpoint],
        queryFn: () => getService(endpoint),
        retry: false,
         enabled: !!endpoint, 
        refetchOnWindowFocus: false,
        refetchInterval: 200
    });
}

export function useDelete() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const execute = async (endpoint) => {
        try {
            setData(null);
            setLoading(true);
            setError("");
            setIsSuccess(false);

            const response = await deleteService(endpoint);

            if (!response.ok) {
                let message = "Request failed.";

                const errorData = await safeJson(response);

                if (response.status === 401) {
                    message = errorData?.message || "Unauthorized. Please login again.";
                } 
                else if (response.status === 403) {
                    message = errorData?.message || "You do not have permission.";
                } 
                else if (response.status === 404) {
                    message = errorData?.message || "Resource not found.";
                } 
                else if (response.status === 409) {
                    message = errorData?.message || "Conflict.";
                } 
                else if (response.status === 500) {
                    message = "Server error. Please try again later.";
                } 
                else {
                    message = errorData?.message || `Request failed with status ${response.status}`;
                }

                setError(message);
                return null;
            }

            // Handle empty DELETE responses (204 No Content)
            let result = null;

            if (response.status !== 204) {
                result = await response.json();
                setData(result);
            }

            setIsSuccess(true);

            return result?.data ?? result;

        } catch (error) {
            if (error instanceof TypeError) {
                if (!navigator.onLine) {
                    setError("No internet connection.");
                } else {
                    setError("An error occurred. Please check your connection or try again later.");
                }
            } else {
                setError(error.message);
            }

            return null;

        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, isSuccess, execute };
}