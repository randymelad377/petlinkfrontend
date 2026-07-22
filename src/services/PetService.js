const API_URL = import.meta.env.VITE_API_URL;


export function postService(endpoint, formData) {

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

export function deleteService(endpoint) {
    const token = localStorage.getItem("token");

    return fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
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
            message = `${err.message} ${err.status}`
            throw err;
        }

        return response.json();
    } catch (error) {

        if (error instanceof TypeError) {
            if (!navigator.onLine) {
                error.message = "No internet connection.";
            } else {
                error.message = "An error occurred. Please check your connection or try again later.";
            }

            error.status = 500;
        }

        throw error;
    }
}