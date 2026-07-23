import { NavLink, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import Style from "./Login.module.css";
import { usePostWithImage } from "../../helpers/AuthHelper";
import { useEffect, useState } from "react";

function Login() {

    const navigate = useNavigate();
    
    const [username, setUsername] = useState("randy@@377");
    const [password, setPassword] = useState("password");

    const { data: postData, loading: postLoading, error: postError, isSuccess: postIsSuccess, execute:postExecute } = usePostWithImage();

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append("username", username);
        formData.append("password", password);

        postExecute("user/login", formData);
    }

    useEffect(() => {
        if (postIsSuccess) {
            localStorage.setItem("token", postData.token);
            console.log(postData)
            navigate("/")
        }
    }, [postIsSuccess])
    
    return (
        <div className="mainContainer"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",    
                                        height: "100vh"          
                                    }}>
            <main className={Style.loginMain} >
                <form onSubmit={handleSubmit} className={Style.loginForm}>

                    <h1 className={Style.h1}>Login</h1>

                    <div className={Style.inputOuterContainer}>
                        <label className={Style.label}>Username</label>
                        <div className={Style.inputContainer}>
                            <FaRegUser className={Style.icon}></FaRegUser>
                            <input type="text" className={Style.inputUserName} value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                    </div>

                    <div className={Style.inputOuterContainer}>
                        <label className={Style.icon}>Password</label>
                        <div className={Style.inputContainer}>
                            <CiLock></CiLock>
                            <input type="password" className={Style.inputPassword} value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    {
                        postLoading && (<p style={{"color" : "black"}} className={Style.serverMsg}>Loading...</p>) 
                    }
                    {
                        postError && (<p style={{"color" : "black", "textAlign" : "center", "color" : "red"}} className={Style.serverMsg}>{postError}</p>) 
                    }

                    
                    <div className={Style.linkContainer}>
                        <NavLink to="/register" className={Style.forgetNavLink}>Register</NavLink>
                        <NavLink to="/forget" className={Style.forgetNavLink}>Forgot Password?</NavLink>
                    </div>

                    <button className={Style.submitButton}>LOGIN</button>
                    <NavLink to="/" className={Style.quickView}>Quick View</NavLink>

                </form>
            </main>
        </div>
    )

}

export default Login