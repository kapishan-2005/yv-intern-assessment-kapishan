import {useState,useEffect } from "react";
import api from "../services/api";
import {useAuth} from "../context/AuthContext";

const MemberDashboard =() => {
    const {user, logout} = useAuth();
    const[application,setApplication] = useState(null);
    const[membership,setMembership] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=> {
      fetchMyApplication();
    },[]);

    const fetchMyApplication =async () => {
        try{
            const res = await api.get("/applications/my");
            setApplication(res.data);
            if (res.data.status === "APPROVED") {
                try{
                    const memRes =await api.get("/applications/my/membership");
                    setMembership(memRes.data);
                }
                catch (e) {
                    setMembership(null);
                }
            }
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
        <div className= "card" style={{maxWidth: 600, margin: "30px auto"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <h2>Welcome, {user.name}</h2>
                <button onClick={logout}>Logout</button>
            </div>

            {application ? (
                <ApplicationStatus application={application} membership={membership} />
            ) : (
                <ApplicationForm onSubmitted={fetchMyApplication}/>            
                )}
        </div>    
    );
};

const ApplicationStatus = ({application, membership}) => (
    <div>
        <h3>My Application</h3>
        <p><strong>Status:</strong>{application.status}</p>
        <p><strong>Applicant Type:</strong>{application.applicantType}</p>
        <p><strong>Name:</strong>{application.fullName || application.companyName}</p>
        <p><strong>Membership Type:</strong>{application.membershipType ?.name}</p>
        {application.status === "REJECTED" && (
            <p style={{ color: "red"}}><strong>Rejection Reason:</strong>{application.rejectionReason}</p>
        )}
        {application.status === "APPROVED" && membership && (
            <p><strong>Membership Number:</strong> {membership.membershipNo}</p>
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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [membershipType, setMembershipType] = useState("");
    const [membershipTypes, setMembershipTypes] = useState([]);

    useEffect(() => {
        api.get("/membership-types").then((res) => {
            setMembershipTypes(res.data);
            if (res.data.length > 0) setMembershipType(res.data[0]._id);
        });
    }, []);

     const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            await api.post("/applications", {
                applicantType,
                fullName: applicantType === "INDIVIDUAL" ? fullName : undefined,
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
                    <select value={applicantType}  onChange={(e) => setApplicantType(e.target.value)} required>
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="COMPANY">Company</option>
                    </select>
                </div>
               
                {applicantType === "INDIVIDUAL" ? (
                    <div>
                        <label>Full Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                ) : (
                    <div>
                        <label>Company Name</label>
                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                    </div>
                )}

                <div>
                    <label>{applicantType === "INDIVIDUAL" ? "NIC" : "Business Registration No"}</label>
                    <input type="text" value={nicOrRegNo} onChange={(e) => setNicOrRegNo(e.target.value)} required />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div>
                    <label>Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required  pattern="[0-9]{9,15}" title="phone number must be 9-15 digits"/>
                </div>

                <div>
                    <label>Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>

                <div>
                   <label>Membership Type</label>
                    <select value={membershipType} onChange={(e) => setMembershipType(e.target.value)} required>
                        {membershipTypes.map((t) => (
                            <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
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

