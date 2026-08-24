import {useState,useEffect } from "react";
import api from "../services/api";
import {useAuth} from "../context/AuthContext";

const MemberDashboard =() => {
    const {user, logout} = useAuth();
    const[application,setApplication] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=> {
      fetchMyApplication();
    },[]);

    const fetchMyApplication =async () => {
        try{
            const res = await api.get("/applications/my");
            setApplication(res.data);
        }
        catch (err) {
            setApplication(null);
        }
        finally{
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return(
        <div styel={{maxWidth: 600, margin: "30px auto"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <h2>Welcome, {user.name}</h2>
                <button onClick={logout}>Logout</button>
            </div>

            {application ? (
                <ApplicationStatus application={appliaction} />
            ) : (
                <ApplicationForm onSubmitted={fetchMyApplication}/>            
                )}
        </div>    
    );
};

const ApplicationStatus = ({application}) => (
    <div>
        <h3>My Application</h3>
        <p><strong>Status:</strong>{application.status}</p>
        <p><strong>Applicant Type:</strong>{application.applicationType}</p>
        <p><strong>Name:</strong>{application.fullName || application.companyName}</p>
        <p><strong>Membership Type:</strong>{application.membershipType}</p>
        {application.status === "REJECTED" && (
            <p style={{ color: "red"}}><strong>Rejection Reason:</strong>{application.rejectionReason</p>
        )}
    </div>
);

const ApplicationForm = ({ onSubmitted}) => {
    const [applicantType, setApplicantType] = useState("INDIVIDUAL");
    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [nicOrRegNo, setNicOrRegNo] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [membershipType, setMembershipType] = useState("Standard");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("false");

     const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            await api.post("/applications", {
                applicantType,
                fullName: application === "INDIVIDUAL" ? fullName : undefined,
                companyName: applicantType === "COMPANY" ? companyName : undefined,
                nicOrRegNo,
                email,
                phone,
                address,
                membershipType,
            });
            onSubmitted();
        }
        catch (err) {
            setError(err.response?.data?.message || "Submission failed");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Submit Membership Application</h3>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Applicant Type</label>
                    <select value="applicantType"  onChange={(e) => setEmail(e.target.value)} required>
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="COMPANY">Company</option>
                    </select>
                </div>
               
                {applicantType === "INDIVIDUAL" ? (
                    <div>
                        <label>Full Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target)} required />
                    </div>
                ) : (
                    <div>
                        <label>Company Name</label>
                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target)} required />
                    </div>
                )}

                <div>
                    <label>{applicationType === "INDIVIDUAL" ? "NIC" : "Business Registration No"}</label>
                     <input type="text" value={nicOrRegNo} onChange={(e) => setNicOrRegNo(e.target)} required />
                </div>

                 <div>
                    <label>Email</label>
                     <input type="email" value={email} onChange={(e) => setEmail(e.target)} required />
                </div>

                <div>
                    <label>Phone</label>
                     <input type="text" value={phone} onChange={(e) => setPhone(e.target)} required />
                </div>

                <div>
                    <label>Address</label>
                     <input type="text" value={address} onChange={(e) => setAddress(e.target)} required />
                </div>

                <div>
                    <label>Membership Type</label>
                    <select value={membershipType} onChange={(e) => setMembershipType(e.target.value)}>
                        <option value="Standard">Standard</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Premium">Premium</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "submitting..." : "Submit Application"}
                </button>
            </form>
        </div>
    );
};

export default MemberDashboard;

