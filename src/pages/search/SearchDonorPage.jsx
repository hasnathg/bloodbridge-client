import React, { useCallback, useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import logo from '../../assets/logo4.JPG'
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import autoTable from "jspdf-autotable";
import axios from 'axios';
import { useAuth } from '../../provider/AuthContext';




const SearchDonorPage = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSearched, setIsSearched] = useState(false);
  const limit = 5;

  const { user } = useAuth();

  //  Fetch districts and upazilas
  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));

    fetch("/data/upazilas.json")
      .then((res) => res.json())
      .then((data) => setUpazilas(data));
  }, []);

  //  Get district name by ID
  const getDistrictName = (id) => {
    const d = districts.find((dist) => String(dist.id) === String(id));
    return d ? d.name : id;
  };

  //  Fetch donations with pagination
  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const selectedDistrictName = district
        ? districts.find((d) => String(d.id) === String(district))?.name
        : "";

      const params = {
        bloodGroup,
        district: selectedDistrictName || "",
        upazila,
        page,
        limit,
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/donations/public`,
        { params }
      );
      setResults(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  }, [bloodGroup, district, upazila, page, districts]);

  //  Search button
  const handleSearch = () => {
    setIsSearched(true);
    setPage(1);
    fetchDonations();
  };

  //  Reset filters
  const resetFilters = () => {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    setResults([]);
    setTotal(0);
    setPage(1);
    setIsSearched(false);
  };

  //  Download PDF (Fetch ALL pages)
  const downloadPDF = async () => {
    try {
      const selectedDistrictName = district
        ? districts.find((d) => String(d.id) === String(district))?.name
        : "";

      //  Fetch all data 
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/donations/public`,
        {
          params: {
            bloodGroup,
            district: selectedDistrictName || "",
            upazila,
            page: 1,
            limit: total || 1000, // Fetch all data or a large number
          },
        }
      );

      const allResults = data.data || [];

      //  Create PDF
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("BloodBridge Donor Report", 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

      //  Add logo
      doc.addImage(logo, "JPEG", 160, 10, 30, 20);

      const tableColumn = ["Name", "Blood Group", "District", "Upazila", "Email"];
      const tableRows = allResults.map((donation) => [
        donation.recipientName,
        donation.bloodGroup,
        donation.recipientDistrict || "Not Provided",
        donation.recipientUpazila || "Not Provided",
        donation.requesterEmail,
      ]);

      autoTable(doc, {
        startY: 40,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 9 },
      });

      doc.save("donor-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 shadow rounded mt-6 pb-32">
      <h2 className="text-2xl font-bold mb-6 text-center">Search Donors</h2>

      {/*  Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="select select-bordered"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setUpazila("");
          }}
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={upazila}
          onChange={(e) => setUpazila(e.target.value)}
          disabled={!district}
        >
          <option value="">Select Upazila</option>
          {upazilas
            .filter((u) => u.district_id === district)
            .map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
        </select>

        <div className="flex gap-2">
          <button onClick={handleSearch} className="btn btn-accent text-black">
            Search
          </button>
          <button onClick={resetFilters} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </div>

      {/*  Results */}
      {loading ? (
        <LoadingSpinner />
      ) : isSearched ? (
        results.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold">{total} donors found</p>
              <button onClick={downloadPDF} className="btn btn-success btn-sm">
                Download PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Blood Group</th>
                    <th>District</th>
                    <th>Upazila</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((donation) => (
                    <tr key={donation._id}>
                      <td className="font-semibold">{donation.recipientName}</td>
                      <td>{donation.bloodGroup}</td>
                      <td>{donation.recipientDistrict || "Not Provided"}</td>
                      <td>{donation.recipientUpazila || "Not Provided"}</td>
                      <td>{donation.requesterEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/*  Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPage(idx + 1);
                      fetchDonations();
                    }}
                    className={`btn btn-sm ${
                      page === idx + 1 ? "btn-accent" : "btn-outline"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">No donors found.</p>
        )
      ) : (
        <p className="text-center text-gray-500">Please use the filters and click Search.</p>
      )}
    </div>
  );
};

export default SearchDonorPage;