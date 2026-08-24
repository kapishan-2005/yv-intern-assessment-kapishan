import {useState} from "react";
import {useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {useAuth} from "../context/AuthContext";

const Login = () => {
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
            const res = await api.post("/auth/login", {email, password});
            login(res.data);

            if (res.data.role === "CHAIRMAN" || res.data.role === "OFFICER") {
                navigate("/staff/dashboard");
            }
            else{
                navigate("/member/dashboard");
            }
        }
        catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: 400, margin: "50px auto"}}>
            <h2>Login</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p>Don't have an account? <Link to ="/register">Register</Link></p>
        </div>
    );
};

export default Login;