import { useState } from "react";
import { postWithImage, getService, putService} from "../services/AuthServices";
import { useQuery } from "@tanstack/react-query";

const safeJson = async (response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
}
export function usePostWithImage(){
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

            const response = await postWithImage(endpoint, formData);

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
    
    const execute  = async (endpoint, rawFormData) => {
        try {
            setData(null);
            setLoading(true);
            setError("");

            const formData = new FormData();

            Object.entries(rawFormData).forEach(([key, value]) =>(
                formData.append(key, value)
            ))
            
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

            return null;

        } finally{
            setLoading(false);
        }
    }

    return { data, loading, error, execute };
}
export function useGet(endpoint) {
    return useQuery({
        queryKey: ["getUser", endpoint],
        queryFn: () => getService(endpoint),
        refetchOnWindowFocus: false,
        retry: false
    });
}