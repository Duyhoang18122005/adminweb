// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import { useEffect, useState } from 'react';
import { banPlayerById, fetchReports, unbanPlayerById, updateReportStatus } from '../api/CallApiReport';
import AdminLayout from './AdminLayout';

/**
 * @typedef {Object} Report
 * @property {string} id
 * @property {string} reporter
 * @property {string} reportedUser
 * @property {string} content
 * @property {string} time
 * @property {'pending' | 'resolved' | 'ignored'} status
 */

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

const Report = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDescription, setBanDescription] = useState('');
  const [banTargetId, setBanTargetId] = useState(null);
  const [banLoading, setBanLoading] = useState(false);
  const [banError, setBanError] = useState('');
  const [banStatus, setBanStatus] = useState('RESOLVED');
  const [banResolution, setBanResolution] = useState('Đã xử lý vi phạm');
  const [unbanningIds, setUnbanningIds] = useState([]);

  useEffect(() => {
    const getReports = async () => {
      const data = await fetchReports();
      // Map API data to table format
      const mapped = data.map((item) => ({
        id: item.id,
        reporter: item.reporter?.username || '',
        reporterAvatar: item.reporter?.avatarUrl || item.reporter?.profileImageUrl || DEFAULT_AVATAR,
        reportedUser: item.reportedPlayer?.user?.username || '',
        reportedUserAvatar: item.reportedPlayer?.user?.avatarUrl || item.reportedPlayer?.user?.profileImageUrl || DEFAULT_AVATAR,
        content: item.reason + (item.description ? `: ${item.description}` : ''),
        time: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
        status: item.status ? item.status.toLowerCase() : 'pending',
        raw: item,
      }));
      setReports(mapped);
    };
    getReports();
  }, []);

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleBanClick = (report) => {
    setBanTargetId(report.raw.reportedPlayer?.id || report.raw.reportedPlayer?.user?.id);
    setBanReason('');
    setBanDescription('');
    setBanError('');
    setBanStatus('RESOLVED');
    setBanResolution('Đã xử lý vi phạm');
    setSelectedReport(report); // để lấy id report
    setShowBanModal(true);
  };

  const handleBanConfirm = async () => {
    if (!banReason.trim()) {
      setBanError('Vui lòng nhập lý do ban.');
      return;
    }
    if (!banStatus) {
      setBanError('Vui lòng chọn trạng thái.');
      return;
    }
    setBanLoading(true);
    setBanError('');
    try {
      await banPlayerById(banTargetId, banReason, banDescription);
      await updateReportStatus(selectedReport.id, banStatus, banResolution);
      setShowBanModal(false);
      setBanLoading(false);
      // Optionally, refresh reports or update status
      window.location.reload();
    } catch (e) {
      setBanError('Có lỗi xảy ra khi ban người chơi hoặc cập nhật trạng thái báo cáo.');
      setBanLoading(false);
    }
  };

  const handleUnban = async (report) => {
    const playerId = report.raw.reportedPlayer?.id || report.raw.reportedPlayer?.user?.id;
    setUnbanningIds((prev) => [...prev, playerId]);
    try {
      await unbanPlayerById(playerId);
      // Optionally, update UI or reload
      // window.location.reload();
      // Cập nhật trạng thái icon sang xám bằng cách giữ playerId trong unbanningIds
    } catch (e) {
      // Xử lý lỗi nếu cần
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'ignored':
        return 'bg-gray-100 text-gray-800';
      case 'banned':
        return 'bg-yellow-300 text-yellow-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ xử lý';
      case 'resolved':
        return 'Đã xử lý';
      case 'ignored':
        return 'Đã bỏ qua';
      case 'banned':
        return 'Đã ban';
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Báo cáo Vi phạm</h1>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>

              <div>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Đang chờ xử lý</option>
                  <option value="resolved">Đã xử lý</option>
                  <option value="ignored">Đã bỏ qua</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                  Áp dụng
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                  Đặt lại
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đối tượng bị tố cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <img src={report.reporterAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                        <span>{report.reporter}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <img src={report.reportedUserAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                        <span>{report.reportedUser}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{report.content}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(report)}
                          className="text-blue-600 hover:text-blue-900 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                          <i className="fas fa-eye mr-1"></i> Xem
                        </button>
                        {report.status === 'pending' && (
                          <>
                            <button className="text-yellow-600 hover:text-yellow-900 !rounded-button whitespace-nowrap cursor-pointer" onClick={() => handleBanClick(report)}>
                              <i className="fas fa-ban mr-1"></i> Ban
                            </button>
                            <button className="text-red-600 hover:text-red-900 !rounded-button whitespace-nowrap cursor-pointer">
                              <i className="fas fa-times mr-1"></i> Bỏ qua
                            </button>
                          </>
                        )}
                        {report.status === 'resolved' && (
                          <button
                            className={`!rounded-button whitespace-nowrap cursor-pointer ${unbanningIds.includes(report.raw.reportedPlayer?.id || report.raw.reportedPlayer?.user?.id) ? 'text-gray-400' : 'text-yellow-500 hover:text-yellow-700'}`}
                            onClick={() => handleUnban(report)}
                            disabled={unbanningIds.includes(report.raw.reportedPlayer?.id || report.raw.reportedPlayer?.user?.id)}
                            title="Unban người chơi"
                          >
                            <i className="fas fa-undo mr-1"></i> Unban
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                Trước
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> của{' '}
                  <span className="font-medium">97</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                    <span className="sr-only">Trước</span>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                    <span className="sr-only">Sau</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Detail Modal */}
          {showModal && selectedReport && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Chi tiết báo cáo
                        </h3>
                        <div className="mt-2 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Mã báo cáo</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedReport.id}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Người báo cáo</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedReport.reporter}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Đối tượng bị tố cáo</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedReport.reportedUser}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedReport.content}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Thời gian</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedReport.time}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                            <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                              {getStatusText(selectedReport.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    {selectedReport.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                        >
                          <i className="fas fa-ban mr-1"></i> Ban
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                        >
                          Bỏ qua
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={() => setShowModal(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ban Modal */}
          {showBanModal && (
            <div className="fixed z-20 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Ban người chơi
                        </h3>
                        <div className="mt-2 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Lý do ban <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
                              value={banReason}
                              onChange={e => setBanReason(e.target.value)}
                              placeholder="Nhập lý do ban..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                            <textarea
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
                              value={banDescription}
                              onChange={e => setBanDescription(e.target.value)}
                              placeholder="Nhập mô tả chi tiết (nếu có)..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Trạng thái xử lý <span className="text-red-500">*</span></label>
                            <div className="flex gap-4 mt-1">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  className="form-radio text-yellow-500"
                                  name="banStatus"
                                  value="RESOLVED"
                                  checked={banStatus === 'RESOLVED'}
                                  onChange={() => setBanStatus('RESOLVED')}
                                />
                                <span className="ml-2">Đã xử lý vi phạm</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  className="form-radio text-red-500"
                                  name="banStatus"
                                  value="REJECTED"
                                  checked={banStatus === 'REJECTED'}
                                  onChange={() => setBanStatus('REJECTED')}
                                />
                                <span className="ml-2">Bỏ qua</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Nội dung xử lý</label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
                              value={banResolution}
                              onChange={e => setBanResolution(e.target.value)}
                              placeholder="Nhập nội dung xử lý..."
                            />
                          </div>
                          {banError && <div className="text-red-500 text-sm">{banError}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={handleBanConfirm}
                      disabled={banLoading}
                    >
                      {banLoading ? 'Đang xử lý...' : 'Xác nhận Ban & Cập nhật trạng thái'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer !rounded-button whitespace-nowrap"
                      onClick={() => setShowBanModal(false)}
                      disabled={banLoading}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Report;
