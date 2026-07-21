import { Outlet } from "react-router-dom";
import { UserInfoContext } from "../context/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function AuthLayout() {

    const userContext = useContext(UserInfoContext);
    
    if (userContext.isLoading) {
        return <h2>Loading...</h2>
    }
    
    if (!userContext.userInfo) {
        return <Navigate to="/login"></Navigate>
    }

    return (
        <Outlet></Outlet>
    )
}

export default AuthLayout