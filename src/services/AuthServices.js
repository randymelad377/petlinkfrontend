const API_URL = "http://127.0.0.1:8000/api/";

export function postWithImage(endpoint, formData) {

    const token = localStorage.getItem("token");

    return fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
    })    
}

export function putService(endpoint, formData) {

    const token = localStorage.getItem("token");

    return fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
    })    
}

export async function getService(endpoint) {

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            ...(token && {Authorization: `Bearer ${token}`})
        }
    })

        if (!response.ok) {
            let message = "Request Failed.";
            
            try {
                const errData = await response.json();
                message = errData.message || message;
            } catch { }
            
            let err = new Error(message);
            err.status = response.status;
            message = `${error.message} ${err.status}`
            throw err;
        }

        return response.json();
    } catch (error) {

        if (!error.status) {
            error.message = "Network error or server unavailable.";
        }

        throw error;
    }
}