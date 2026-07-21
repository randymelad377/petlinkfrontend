import { Navigate, Outlet } from "react-router-dom";
import { UserInfoContext } from "../context/UserContext";
import Header from "../components/semantics/Header";
import { useEffect, useState } from "react";
import { useGet } from "../helpers/AuthHelper";
import LayoutLoading from "../components/feedbackComponents/LayoutLoading";
import LayoutError from "../components/feedbackComponents/LayoutError";
function UserLayout() {
    
    const { data, isLoading, error } = useGet("user/getCurrentUser");

    if (isLoading) return <LayoutLoading/>;
    if (error) return <LayoutError error={error }/>
    if (data) {
        if (data?.data) {
            if (data?.data?.role != "user") {
                return <Navigate to="/admin" replace />;
            }
        }
    }

    const userInfo = data?.data || null;

    return (
        <UserInfoContext.Provider value={{userInfo, isLoading}}>
            <div className="layout">
                <Header></Header>
                <Outlet></Outlet>
            </div>
        </UserInfoContext.Provider>
    )
}

export default UserLayout