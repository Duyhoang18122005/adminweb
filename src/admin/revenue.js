// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import { useEffect, useState } from 'react';
import { fetchOrderStats, fetchOrderSummary } from '../api/CallApidashboard';
import AdminLayout from './AdminLayout';

const Payment = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  // Add state for API statistics
  const [apiStats, setApiStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]); // Chỉ dùng orders từ API

  // Lấy ngày hôm nay dạng yyyy-MM-dd
  const todayStr = new Date().toISOString().slice(0, 10);

  const todayConfirmedOrders = orders.filter(order => order.statusLabel === 'Đã xác nhận' && order.date === todayStr);
  // Dữ liệu thống kê
  const statistics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (["Bị hủy", "Chờ xác nhận"].includes(order.statusLabel) ? 0 : Math.round(order.price * 0.1)), 0),
    todayRevenue: todayConfirmedOrders.length > 0 ? Math.round(todayConfirmedOrders.reduce((sum, order) => sum + order.price, 0) * 0.1) : 0,
    averageRevenuePerOrder: orders.length > 0 ? Math.round(orders.reduce((sum, order) => sum + (["Bị hủy", "Chờ xác nhận"].includes(order.statusLabel) ? 0 : Math.round(order.price * 0.1)), 0) / orders.length) : 0
  };

  useEffect(() => {
    fetchOrderStats().then(stats => {
      if (stats) {
        setApiStats({
          totalOrders: stats.totalOrders,
          totalRevenue: stats.totalRevenue
        });
      }
    });
    fetchOrderSummary().then(data => {
      setOrders(Array.isArray(data) ? data : []);
    });
  }, []);

  // Lọc và sắp xếp đơn hàng
  const filteredOrders = orders
    .filter(order => {
      if (searchTerm) {
        return (
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.gamer.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortColumn === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortColumn === 'total') {
        return sortDirection === 'asc' ? a.total - b.total : b.total - a.total;
      } else if (sortColumn === 'adminFee') {
        return sortDirection === 'asc' ? a.adminFee - b.adminFee : b.adminFee - a.adminFee;
      }
      return 0;
    });

  // Phân trang
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý sắp xếp
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Lọc đơn theo ngày đã chọn cho bảng chi tiết
  const selectedDate = startDate || todayStr;
  const filteredOrdersByDate = orders.filter(order => order.date === selectedDate);

  return (
    <AdminLayout breadcrumb="Quản lý doanh thu">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý doanh thu</h1>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Bộ lọc thời gian */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Bộ lọc thời gian</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setTimeFilter('today');
                  setShowDatePicker(false);
                }}
                className={`px-4 py-2 rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${timeFilter === 'today'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => {
                  setTimeFilter('7days');
                  setShowDatePicker(false);
                }}
                className={`px-4 py-2 rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${timeFilter === '7days'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                7 ngày qua
              </button>
              <button
                onClick={() => {
                  setTimeFilter('30days');
                  setShowDatePicker(false);
                }}
                className={`px-4 py-2 rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${timeFilter === '30days'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                30 ngày qua
              </button>
              <button
                onClick={() => {
                  setTimeFilter('custom');
                  setShowDatePicker(true);
                }}
                className={`px-4 py-2 rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${timeFilter === 'custom'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Tùy chỉnh
              </button>
            </div>

            {showDatePicker && (
              <div className="mt-4 flex flex-wrap gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
                    onClick={() => {
                      // Xử lý lọc theo khoảng thời gian tùy chỉnh
                    }}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tổng quan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <i className="fas fa-shopping-cart text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Tổng số đơn</h3>
                  <p className="text-2xl font-semibold text-gray-900">{statistics.totalOrders}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Tổng số đơn thuê được tạo</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-pink-100 text-pink-600">
                  <i className="fas fa-money-bill-wave text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu hệ thống</h3>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(statistics.totalRevenue)}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Tổng tiền × 10%</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <i className="fas fa-calendar-day text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Doanh thu hôm nay</h3>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(statistics.todayRevenue)}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Chỉ lấy những đơn hôm nay</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <i className="fas fa-chart-line text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Trung bình thu / đơn</h3>
                  <p className="text-2xl font-semibold text-gray-900">{formatCurrency(statistics.averageRevenuePerOrder)}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Tổng doanh thu / số đơn</p>
            </div>
          </div>



          {/* Bảng chi tiết đơn hàng */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Chi tiết đơn thuê</h2>
                <div className="mt-2 sm:mt-0">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="Tìm kiếm đơn hàng..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mã đơn
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Người thuê
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Game thủ
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Ngày
                        {sortColumn === 'date' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? (
                              <i className="fas fa-sort-up"></i>
                            ) : (
                              <i className="fas fa-sort-down"></i>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center">
                        Tổng tiền
                        {sortColumn === 'total' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? (
                              <i className="fas fa-sort-up"></i>
                            ) : (
                              <i className="fas fa-sort-down"></i>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('adminFee')}
                    >
                      <div className="flex items-center">
                        Phí admin (10%)
                        {sortColumn === 'adminFee' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? (
                              <i className="fas fa-sort-up"></i>
                            ) : (
                              <i className="fas fa-sort-down"></i>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrdersByDate.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 cursor-pointer">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={order.renterAvatarUrl} alt={order.renterName} className="h-8 w-8 rounded-full object-cover" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{order.renterName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={order.playerAvatarUrl} alt={order.playerName} className="h-8 w-8 rounded-full object-cover" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{order.playerName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.timeRange}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                        {['Bị hủy', 'Chờ xác nhận'].includes(order.statusLabel)
                          ? formatCurrency(0)
                          : formatCurrency(Math.round(order.price * 0.1))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {order.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredOrdersByDate.length)}
                    </span>{' '}
                    trong <span className="font-medium">{filteredOrdersByDate.length}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
                    >
                      <span className="sr-only">Trang trước</span>
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap ${page === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap"
                    >
                      <span className="sr-only">Trang sau</span>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );

};

export default Payment;
// Note: Ensure you have Font Awesome icons available in your project for the icons to render correctly. 