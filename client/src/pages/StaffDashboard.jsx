import { useState, useEffect} from "react";
import api from "../services/api";
import {useAuth} from "../context/AuthContext";

const StaffDashboard = () => {
     const {user, logout} = useAuth();
     const[applications,setApplications] = useState([]);
     const[statusFilter,setStatusFilter] = useState("");
     const[page,setPage] = useState(1);
     const[totalPages,setTotalPages] = useState(1);
     const[loading,setLoading] = useState(true);
     const[rejectingId,setRejectingId] = useState(null);
     const[rejectReason,setRejectReason] = useState("");


     useEffect(()=>{
        fetchApplications();
     }, [statusFilter, page]);
    
     const fetchApplications = async ()=>{
         setLoading(true);
         try{
            const params = {page,limit:10};
            if (statusFilter) params.status = statusFilter;
            const res = await api.get("/applications", {params});
            setApplications(res.data.data);
            setTotalPages(res.data.totalPages);
         }
         catch(err) {
            console.error(err);
         }
         finally {
            setLoading(false);
         }
     };

     const handleApprove = async (id) => {
        try{
            await api.put(`/applications/${id}/approve`);
            fetchApplications();
        }
        catch(err) {
            alert(err.response?.data?.message || "Approve failed");
        }
     };

      const handleReject = async (id) => {
        try{
            await api.put(`/applications/${id}/reject`, {rejectionReason: rejectReason});
            setRejectingId(null);
            setRejectReason("");
            fetchApplications();
        }
        catch(err) {
            alert(err.response?.data?.message || "Reject failed");
        }
     };

     return (
        <div className="card" style={{maxWidth: 900, margin:"30px auto"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
               <h2>Staff Dashboard - {user.name} ({user.role})</h2>
               <div>
                {user.role === "CHAIRMAN" && (
                    <a href="/chairman/roles" style={{marginRight:10}}>Manage Roles</a>
                )}
                <button onClick={logout}>Logout</button>
               </div>
            </div>

            <div>
                <label>Filter by Status:</label>
                <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setPage(1);}}>
                    <option value="">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ): (
                <table border="1" cellPadding="8" style={{width:"100%"}}>
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Type</th>
                            <th>Membership Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td>{app.fullName || app.companyName}</td>
                                <td>{app.applicantType}</td>
                                <td>{app.membershipType}</td>
                                <td>{app.status}</td>
                                <td>
                                    {app.status === "PENDING" && (
                                        <>
                                            {user.permissions?.includes("application.approve") && (
                                                <button onClick={()=> handleApprove=(app._id)}>Approve</button>
                                            )}
                                            {user.permissions?.includes("application.reject") && (
                                              rejectingId === app._id ? (
                                                <>
                                                <input type="text" 
                                                    placeholder="Reason"
                                                    value={rejectReason} 
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    />
                                                    <button onClick={() => handleReject(app._id)}>Conform reject</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setRejectingId(app._id)}>Reject</button>
                                               )
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{marginTop:10}}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span style={{margin: "0 10px"}}>Page  {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
     );
};

export default StaffDashboard;