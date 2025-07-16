import axios from './axiosConfig';

export const fetchReports = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/reports', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách báo cáo:', error);
        return [];
    }
};
