import React, { useEffect, useState } from 'react';
import { getReports, createReport } from '../api/reportsApi';
import { ClipLoader } from 'react-spinners';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    severity: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [newReport, setNewReport] = useState({
    name: "",
    state: "",
    town: "",
    lga: "",
    date: "",
    description: "",
    severity: "",
    imageUrl: "",
    anonymous: false,
    coordinates: { lat: "", lng: "" },
  });

  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { page, limit, severity, status } = filters;
        const data = await getReports(page, limit, severity, status);
        setReports(data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filters]);

  const handleAddReport = async () => {
    const { name, state, town, lga, date, description, severity, imageUrl, coordinates } = newReport;

    if (!name || !state || !town || !lga || !date || !severity || !imageUrl) {
      alert('All fields are required!');
      return;
    }

    try {
      const addedReport = await createReport(newReport);
      setReports([...reports, addedReport]);
      alert('Report added successfully!');
      setNewReport({
        name: "",
        state: "",
        town: "",
        lga: "",
        date: "",
        description: "",
        severity: "",
        imageUrl: "",
        anonymous: false,
        coordinates: { lat: "", lng: "" },
      });
    } catch (error) {
      console.error('Error adding report:', error);
      alert('Failed to add report. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePagination = (direction) => {
    const newPage = filters.page + direction;
    if (newPage > 0) {
      setFilters({ ...filters, page: newPage });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (file.size > maxSize) {
        alert('File is too large! Please select a file smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setNewReport({ ...newReport, imageUrl: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Flood Reports</h1>
            <p className="text-lg text-gray-600">Monitor and manage flood incidents across different locations.</p>
          </div>
          <button
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300"
            onClick={() => setShowModal(true)}
          >
            Report New Incident
          </button>
        </div>

        <div className="mb-6 text-xl font-semibold text-gray-800">
          Filter reports by Severity and Status:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Severity Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Severity</label>
            <select
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              className="w-full p-3 mt-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-3 mt-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex justify-center items-center my-6">
            <ClipLoader size={50} color="#4A90E2" loading={loading} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.length === 0 ? (
              <p className="text-xl text-gray-700 text-center w-full">No reports found for the selected filters.</p>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start"
                >
                  <div className="space-y-4">
                    <p className="text-lg font-medium text-gray-800">Reported by: {report.name}</p>
                    <p className="text-gray-600">State: {report.state}</p>
                    <p className="text-gray-600">Town: {report.town}, {report.lga}</p>
                    <p className="text-gray-500">Date: {new Date(report.date).toLocaleDateString()}</p>
                    <p className="text-gray-500">Severity: {report.severity}</p>
                  </div>
                  {report.imageUrl && (
                    <img
                      src={report.imageUrl}
                      alt="Flood Report"
                      className="mt-4 w-full rounded-lg shadow-md"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {reports.length > 5 && (
          <div className="flex justify-between mt-8">
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              onClick={() => handlePagination(-1)}
              disabled={filters.page === 1}
            >
              Previous
            </button>
            <button
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              onClick={() => handlePagination(1)}
            >
              Next
            </button>
          </div>
        )}

        {/* Modal for Report Creation */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg text-red-500"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Report</h2>
              <div className="space-y-4">
                {/* Form fields for new report */}
                <div>
                  <label className="block text-lg font-medium">Name</label>
                  <input
                    type="text"
                    value={newReport.name}
                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                    className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium">State</label>
                  <input
                    type="text"
                    value={newReport.state}
                    onChange={(e) => setNewReport({ ...newReport, state: e.target.value })}
                    className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium">Town</label>
                  <input
                    type="text"
                    value={newReport.town}
                    onChange={(e) => setNewReport({ ...newReport, town: e.target.value })}
                    className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium">Date</label>
                  <input
                    type="date"
                    value={newReport.date}
                    onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                    className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium">Severity</label>
                  <select
                    value={newReport.severity}
                    onChange={(e) => setNewReport({ ...newReport, severity: e.target.value })}
                    className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium">Report Image</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full p-3 mt-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <button
                    className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700"
                    onClick={handleAddReport}
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
