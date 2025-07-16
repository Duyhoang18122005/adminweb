import axiosInstance from './axiosConfig';

export const fetchTopupUsers = async (token) => {
    try {
        const response = await axiosInstance.get('/payments/topup-users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
