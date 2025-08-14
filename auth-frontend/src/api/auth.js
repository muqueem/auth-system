
const API_URL = "http://localhost:5000/api/auth";

// const res = await fetch(`${API_URL}`)
export const registerUser = async (data) => {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

export const loginUser = async (data) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

export const forgotPassword = async (data) => {
    const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    return res.json();
}

export const resetPassword = async (token, data) => {
    const res = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

export const verifyUser = async (token) => {
    const res = await fetch("http://localhost:5000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
};


export const getDashboard = async (token) => {
    const res = await fetch("http://localhost:5000/api/protected/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
}