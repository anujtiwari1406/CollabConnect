import axios from "axios";

import { API_BASE_URL } from "../config";

const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/auth`;

// Create axios instance
const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 600000, // 10 minutes for long AI generation tasks
});

// Add token to headers if it exists
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("collaborator_user"));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const authService = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    login: async (userData) => {
        const response = await axios.post(`${API_URL}/login`, userData);
        if (response.data) {
            localStorage.setItem("collaborator_user", JSON.stringify(response.data));
        }
        return response.data;
    },

    googleLogin: async (idToken) => {
        const response = await axios.post(`${API_URL}/google`, { idToken });
        if (response.data) {
            localStorage.setItem("collaborator_user", JSON.stringify(response.data));
        }
        return response.data;
    },

    verifyOtp: async (email, otp) => {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        if (response.data && response.data.token) {
            localStorage.setItem("collaborator_user", JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("collaborator_user");
    },

    resendOtp: async (email) => {
        const response = await axios.post(`${API_URL}/resend-otp`, { email });
        return response.data;
    },

    getMe: async (token) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL}/me`, config);
        if (response.data) {
            // Include token back in the data so it remains available in state/storage
            const userData = { ...response.data, token };
            localStorage.setItem("collaborator_user", JSON.stringify(userData));
            return userData;
        }
        return null;
    }
};

export const profileService = {
    saveBrand: async (data, token) => {
        // Saving brand...
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.post(`${API_URL.replace("/auth", "")}/brand`, data, config);
        return response.data;
    },
    saveInfluencer: async (data, token) => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.post(`${API_URL.replace("/auth", "")}/influencer`, data, config);
        return response.data;
    },
    getBrand: async (token) => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL.replace("/auth", "")}/brand`, config);
        return response.data;
    },
    getInfluencer: async (token) => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL.replace("/auth", "")}/influencer`, config);
        return response.data;
    },
    getInfluencerById: async (userId) => {
        const response = await api.get(`/influencer/${userId}`);
        return response.data;
    },
    getBrandById: async (userId) => {
        const response = await api.get(`/brand/${userId}`);
        return response.data;
    }
};

export const matchService = {
    getBrandMatches: async (CollabId) => {
        const response = await api.post("/match/brand", { CollabId });
        return response.data;
    },
    getInfluencerMatches: async (CollabId) => {
        const response = await api.post("/match/influencer", { CollabId });
        return response.data;
    }
};


export const chatService = {
    accessChat: async (userId) => {
        const response = await api.post("/chat", { userId });
        return response.data;
    },
    fetchChats: async () => {
        const response = await api.get("/chat");
        return response.data;
    },
    sendMessage: async (content, chatId, attachments = [], type = "text") => {
        const response = await api.post("/message", { content, chatId, attachments, type });
        return response.data;
    },
    fetchMessages: async (chatId) => {
        const response = await api.get(`/message/${chatId}`);
        return response.data;
    },
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/upload", formData);
        return response.data;
    },
    recordCollaboration: async (chatId, status) => {
        const response = await api.post("/chat/collab/record", { chatId, status });
        return response.data;
    }
};


export const aiService = {
    suggestReplies: async (chatId) => {
        const response = await api.post("/chat/ai/suggest", { chatId });
        return response.data.suggestions;
    },
    generateOpener: async (matchContext) => {
        const response = await api.post("/chat/ai/opener", { matchContext });
        return response.data.opener;
    },
    enhanceText: async (text) => {
        const response = await api.post("/chat/ai/enhance", { text });
        return response.data.enhancedText;
    },
    summarizeChat: async (chatId) => {
        const response = await api.post("/chat/ai/summarize", { chatId });
        return response.data;
    },
    analyzeProfile: async (profileData) => {
        const response = await api.post("/chat/ai/analyze-profile", { profileData });
        return response.data;
    }
};

export const CollabService = {
    getMemory: async () => {
        const response = await api.get("/Collab/memory");
        return response.data;
    },
    getPublicMemory: async (userId) => {
        const response = await api.get(`/Collab/memory/${userId}`);
        return response.data;
    },
    saveFeedback: async (response, context) => {
        const res = await api.post("/Collab/feedback", { response, context });
        return res.data;
    },
    markGuideSeen: async (guideId) => {
        const res = await api.post("/Collab/guide-seen", { guideId });
        return res.data;
    }
};

export default api;




