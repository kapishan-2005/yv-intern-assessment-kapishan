import { useState, useEffect} from "react";
import api from "../services/api";
import {useAuth} from "../context/AuthContext";

const StaffDashboard = () => {
     const {user, logout} = useAuth();
     const[activeTab,setActiveTab]= useState("applications");

     const[applications,setApplications] = useState([]);
     const[statusFilter,setStatusFilter] = useState("");
     const[page,setPage] = useState(1);
     const[totalPages,setTotalPages] = useState(1);
     const[loading,setLoading] = useState(true);
     const[rejectingId,setRejectingId] = useState(null);
     const[rejectReason,setRejectReason] = useState("");

     const[members,setMember] = useState([]);
     const[memberSearch,setMemberSearch] = useState("");
     const[memberRole,setMemberRole] = useState("");
     const[memberPage,setMemberPage] = useState(1);
     const[memberTotalPages,setMemberTotalPages] = useState(1);
     const[memberLoading,setMemberLoading] = useState(true);


     useEffect(()=>{
        if(activeTab === "applications") fetchApplications();
     }, [statusFilter, page, activeTab]);

     useEffect(()=>{
        if(activeTab === "members") fetchMembers();
     }, [memberSearch, memberRole,memberPage, activeTab]);
    
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

     const fetchMembers = async ()=>{
        setMemberLoading(true);
        try{
            const params = {page: memberPage,limit:10};
            if (memberSearch) params.search = memberSearch;
            if (memberRole) params.role =memberRole;
            const res = await api.get("/users", {params});
            setMember(res.data.data);
            setMemberTotalPages(res.data.totalPages);
        }
        catch(err) {
            console.error(err);

        }
        finally{
            setMemberLoading(false);
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

             <div style={{margin: "15px 0"}}>
                 <button onClick={()=> setActiveTab("applications")} disabled={activeTab ==="applications"}>Applications</button>
                 <button onClick={()=> setActiveTab("members")} disabled={activeTab ==="members"} style={{marginLeft:10}}>Member List</button>
               </div>
            {activeTab === "applications" && (
                <>
                 <div>
                    <label>Filter by status</label>
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
                                <td>{app.membershipType ?.name}</td>
                                <td>{app.status}</td>
                                <td>
                                    {app.status === "PENDING" && (
                                        <>
                                            {user.permissions?.includes("application.approve") && (
                                                <button onClick={()=> handleApprove(app._id)}>Approve</button>
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
        </>
     )}

      {activeTab === "members" && (
              <>
                <div style={{display:"flex", gap:10}}>
                    <input
                        type="text"
                        placeholder="Search name or email"
                        value={memberSearch}
                        onChange={(e) => { setMemberSearch(e.target.value); setMemberPage(1); }}
                    />
                    <select value={memberRole} onChange={(e) => { setMemberRole(e.target.value); setMemberPage(1); }}>
                        <option value="">All Roles</option>
                        <option value="MEMBER">Member</option>
                        <option value="OFFICER">Officer</option>
                    </select>
                </div>

                {memberLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table border="1" cellPadding="8" style={{width:"100%", marginTop:10}}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((m) => (
                                <tr key={m._id}>
                                    <td>{m.name}</td>
                                    <td>{m.email}</td>
                                    <td>{m.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{marginTop:10}}>
                    <button disabled={memberPage === 1} onClick={() => setMemberPage(memberPage - 1)}>Previous</button>
                    <span style={{margin: "0 10px"}}>Page  {memberPage} of {memberTotalPages}</span>
                    <button disabled={memberPage === memberTotalPages} onClick={() => setMemberPage(memberPage + 1)}>Next</button>
                </div>
              </>
            )}
        </div>
     );
};

export default StaffDashboard;