import {useState} from "react";
import {useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {useAuth} from "../context/AuthContext";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try{
            const res = await api.post("/auth/register", {name, email, password});
            login(res.data);
             navigate("/member/dashboard")
           
        }
        catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className= "card" style={{maxWidth: 400, margin: "50px auto"}}>
            <h2>Register</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                </div>
                <button type="submit" disabled={loading}>Register</button>
            </form>
            <p>Already have an account? <Link to ="/login">Login</Link></p>
        </div>
    );
};

export default Register;