const fetchWithAuth = async (url, options = {}) => {

    const token = localStorage.getItem("accessToken");

    if (!token || token === "undefined") {
        return fetch(url, { ...options });
    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });
        return response;
    } catch (error) {
        console.error("fetchWithAuth 요청 실패:", error);
        throw error;
    }
};

export default fetchWithAuth;