import axios from './axiosConfig';

export const fetchOrderStats = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('/orders/stats', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Lấy tổng số đơn hàng từ response
        return response.data.totalOrders;
    } catch (error) {
        console.error('Lỗi khi lấy thống kê đơn hàng:', error);
        return null;
    }
};
