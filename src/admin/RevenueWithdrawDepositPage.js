// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import  { useState } from 'react';
import AdminLayout from './AdminLayout';

const RevenueWithdrawDepositPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('deposit');
  const [depositFilter, setDepositFilter] = useState('all');
  const [withdrawFilter, setWithdrawFilter] = useState('all');
  const [searchDeposit, setSearchDeposit] = useState('');
  const [searchWithdraw, setSearchWithdraw] = useState('');
  const [selectedDepositRows, setSelectedDepositRows] = useState([]);
  const [selectedWithdrawRows, setSelectedWithdrawRows] = useState([]);
  const [selectAllDeposits, setSelectAllDeposits] = useState(false);
  const [selectAllWithdraws, setSelectAllWithdraws] = useState(false);

  // Sample data for deposit orders
  const depositOrders = [
    {
      id: 'DP001',
      user: { name: 'Nguyễn Văn A', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20asian%20man%20with%20short%20black%20hair%20and%20friendly%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=1&orientation=squarish' },
      accountType: 'Người chơi',
      date: '03/07/2025',
      amount: '200.000₫',
      status: 'processed',
      actions: ['view', 'approve', 'reject']
    },
    {
      id: 'DP002',
      user: { name: 'Trần Thị B', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20asian%20woman%20with%20long%20black%20hair%20and%20friendly%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=2&orientation=squarish' },
      accountType: 'Game thủ',
      date: '02/07/2025',
      amount: '500.000₫',
      status: 'pending',
      actions: ['view', 'approve', 'reject']
    },
    {
      id: 'DP003',
      user: { name: 'Lê Văn C', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20middle%20aged%20asian%20man%20with%20glasses%20and%20friendly%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=3&orientation=squarish' },
      accountType: 'Người chơi',
      date: '01/07/2025',
      amount: '100.000₫',
      status: 'rejected',
      actions: ['view']
    },
    {
      id: 'DP004',
      user: { name: 'Phạm Thị D', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20asian%20woman%20with%20short%20black%20hair%20and%20friendly%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=4&orientation=squarish' },
      accountType: 'Game thủ',
      date: '30/06/2025',
      amount: '1.000.000₫',
      status: 'processed',
      actions: ['view']
    },
    {
      id: 'DP005',
      user: { name: 'Hoàng Văn E', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20asian%20man%20with%20stylish%20haircut%20and%20confident%20expression%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=5&orientation=squarish' },
      accountType: 'Người chơi',
      date: '29/06/2025',
      amount: '300.000₫',
      status: 'pending',
      actions: ['view', 'approve', 'reject']
    },
    {
      id: 'DP006',
      user: { name: 'Ngô Thị F', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20middle%20aged%20asian%20woman%20with%20elegant%20hairstyle%20and%20warm%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=6&orientation=squarish' },
      accountType: 'Game thủ',
      date: '28/06/2025',
      amount: '750.000₫',
      status: 'processed',
      actions: ['view']
    }
  ];

  // Sample data for withdraw orders
  const withdrawOrders = [
    {
      id: 'WD001',
      user: { name: 'Trần Thị B', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20asian%20woman%20with%20long%20black%20hair%20and%20friendly%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=2&orientation=squarish' },
      accountType: 'Game thủ',
      date: '03/07/2025',
      amount: '500.000₫',
      status: 'pending',
      actions: ['view', 'approve', 'reject']
    },
    {
      id: 'WD002',
      user: { name: 'Lê Văn C', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20middle%20aged%20asian%20man%20with%20glasses%20and%20friendly%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=3&orientation=squarish' },
      accountType: 'Người chơi',
      date: '02/07/2025',
      amount: '100.000₫',
      status: 'processed',
      actions: ['view']
    },
    {
      id: 'WD003',
      user: { name: 'Phạm Thị D', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20asian%20woman%20with%20short%20black%20hair%20and%20friendly%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=4&orientation=squarish' },
      accountType: 'Game thủ',
      date: '01/07/2025',
      amount: '800.000₫',
      status: 'rejected',
      actions: ['view']
    },
    {
      id: 'WD004',
      user: { name: 'Hoàng Văn E', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20asian%20man%20with%20stylish%20haircut%20and%20confident%20expression%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=5&orientation=squarish' },
      accountType: 'Người chơi',
      date: '30/06/2025',
      amount: '250.000₫',
      status: 'pending',
      actions: ['view', 'approve', 'reject']
    },
    {
      id: 'WD005',
      user: { name: 'Ngô Thị F', avatar: 'https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20middle%20aged%20asian%20woman%20with%20elegant%20hairstyle%20and%20warm%20smile%2C%20minimalist%20white%20background%2C%20high%20quality%20professional%20headshot&width=100&height=100&seq=6&orientation=squarish' },
      accountType: 'Game thủ',
      date: '29/06/2025',
      amount: '650.000₫',
      status: 'processed',
      actions: ['view']
    }
  ];

  // Filter deposit orders based on status and search
  const filteredDepositOrders = depositOrders.filter(order => {
    const matchesFilter = depositFilter === 'all' || 
      (depositFilter === 'processed' && order.status === 'processed') ||
      (depositFilter === 'pending' && order.status === 'pending') ||
      (depositFilter === 'rejected' && order.status === 'rejected');
    
    const matchesSearch = searchDeposit === '' || 
      order.id.toLowerCase().includes(searchDeposit.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchDeposit.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Filter withdraw orders based on status and search
  const filteredWithdrawOrders = withdrawOrders.filter(order => {
    const matchesFilter = withdrawFilter === 'all' || 
      (withdrawFilter === 'processed' && order.status === 'processed') ||
      (withdrawFilter === 'pending' && order.status === 'pending') ||
      (withdrawFilter === 'rejected' && order.status === 'rejected');
    
    const matchesSearch = searchWithdraw === '' || 
      order.id.toLowerCase().includes(searchWithdraw.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchWithdraw.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Handle select all deposits
  const handleSelectAllDeposits = () => {
    if (selectAllDeposits) {
      setSelectedDepositRows([]);
    } else {
      setSelectedDepositRows(filteredDepositOrders.map(order => order.id));
    }
    setSelectAllDeposits(!selectAllDeposits);
  };

  // Handle select all withdraws
  const handleSelectAllWithdraws = () => {
    if (selectAllWithdraws) {
      setSelectedWithdrawRows([]);
    } else {
      setSelectedWithdrawRows(filteredWithdrawOrders.map(order => order.id));
    }
    setSelectAllWithdraws(!selectAllWithdraws);
  };

  // Handle select single deposit row
  const handleSelectDepositRow = (id) => {
    if (selectedDepositRows.includes(id)) {
      setSelectedDepositRows(selectedDepositRows.filter(rowId => rowId !== id));
    } else {
      setSelectedDepositRows([...selectedDepositRows, id]);
    }
  };

  // Handle select single withdraw row
  const handleSelectWithdrawRow = (id) => {
    if (selectedWithdrawRows.includes(id)) {
      setSelectedWithdrawRows(selectedWithdrawRows.filter(rowId => rowId !== id));
    } else {
      setSelectedWithdrawRows([...selectedWithdrawRows, id]);
    }
  };

  // Get status badge color and text
  const getStatusBadge = (status) => {
    switch (status) {
      case 'processed':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Đã xử lý'
        };
      case 'pending':
        return {
          color: 'bg-orange-100 text-orange-800',
          text: 'Đang chờ'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          text: 'Bị từ chối'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Không xác định'
        };
    }
  };

  return (
    <AdminLayout breadcrumb="Doanh thu - Nạp/Rút tiền">
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tab Buttons */}
        <div className="mb-6 flex space-x-4">
          <button
            className={`px-6 py-3 font-medium text-sm rounded-lg !rounded-button whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'deposit'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } shadow-sm`}
            onClick={() => setActiveTab('deposit')}
          >
            Đơn nạp tiền
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm rounded-lg !rounded-button whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'withdraw'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } shadow-sm`}
            onClick={() => setActiveTab('withdraw')}
          >
            Đơn rút tiền
          </button>
        </div>

        {/* Deposit Orders Table */}
        {activeTab === 'deposit' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 md:p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">Đơn nạp tiền</h1>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Tìm theo tên hoặc mã đơn..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchDeposit}
                    onChange={(e) => setSearchDeposit(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                </div>
                
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                      depositFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setDepositFilter('all')}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                      depositFilter === 'processed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setDepositFilter('processed')}
                  >
                    Đã xử lý
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                      depositFilter === 'pending'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setDepositFilter('pending')}
                  >
                    Đang chờ
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                      depositFilter === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setDepositFilter('rejected')}
                  >
                    Bị từ chối
                  </button>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={selectAllDeposits}
                            onChange={handleSelectAllDeposits}
                          />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người nạp
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại tài khoản
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày nạp
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDepositOrders.map((order) => {
                      const statusBadge = getStatusBadge(order.status);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                              checked={selectedDepositRows.includes(order.id)}
                              onChange={() => handleSelectDepositRow(order.id)}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900 font-mono">{order.id}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <img
                                  className="h-8 w-8 rounded-full object-cover"
                                  src={order.user.avatar}
                                  alt={order.user.name}
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.accountType === 'Game thủ' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.accountType}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                            {order.amount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              
                              {order.status === 'pending' && (
                                <>
                                  <button 
                                    className="text-green-600 hover:text-green-900 cursor-pointer"
                                    title="Duyệt đơn"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button 
                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                    title="Từ chối"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {filteredDepositOrders.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">Không tìm thấy đơn nạp tiền nào</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Withdraw Orders Table */}
        {activeTab === 'withdraw' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 md:p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">Đơn rút tiền</h1>
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Tìm theo tên hoặc mã đơn..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchWithdraw}
                    onChange={(e) => setSearchWithdraw(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                </div>
                
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                      withdrawFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setWithdrawFilter('all')}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                      withdrawFilter === 'processed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setWithdrawFilter('processed')}
                  >
                    Đã chuyển
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                      withdrawFilter === 'pending'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setWithdrawFilter('pending')}
                  >
                    Đang chờ
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg !rounded-button whitespace-nowrap cursor-pointer ${
                      withdrawFilter === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setWithdrawFilter('rejected')}
                  >
                    Bị từ chối
                  </button>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={selectAllWithdraws}
                            onChange={handleSelectAllWithdraws}
                          />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người rút
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại tài khoản
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày yêu cầu
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền rút
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredWithdrawOrders.map((order) => {
                      const statusBadge = getStatusBadge(order.status);
                      const statusText = order.status === 'processed' ? 'Đã chuyển' : statusBadge.text;
                      
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                              checked={selectedWithdrawRows.includes(order.id)}
                              onChange={() => handleSelectWithdrawRow(order.id)}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900 font-mono">{order.id}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <img
                                  className="h-8 w-8 rounded-full object-cover"
                                  src={order.user.avatar}
                                  alt={order.user.name}
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.accountType === 'Game thủ' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.accountType}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                            {order.amount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                                title="Xem chi tiết"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              
                              {order.status === 'pending' && (
                                <>
                                  <button 
                                    className="text-green-600 hover:text-green-900 cursor-pointer"
                                    title="Duyệt đơn"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button 
                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                    title="Từ chối"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {filteredWithdrawOrders.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">Không tìm thấy đơn rút tiền nào</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default RevenueWithdrawDepositPage;
