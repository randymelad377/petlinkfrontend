import { Navigate, Outlet } from "react-router-dom"
import { UserInfoContext } from "../../context/UserContext";
import LayoutLoading from "../../components/feedbackComponents/LayoutLoading";
import LayoutError from "../../components/feedbackComponents/LayoutError";
import { useGet } from "../../helpers/AuthHelper";

function AdminLayout() {
    
    const { data, isLoading, error } = useGet("user/getCurrentUser");

    if (isLoading) return <LayoutLoading/>;
    if (error) return <LayoutError error={error} />

    if (data) {
        if (data?.data) {
            if (data?.data?.role !== "admin" && data?.data?.role !== "super_admin") {
                return <Navigate to="/" replace />;
            }
        } else {
            return <Navigate to="/login"></Navigate>
        }
    } 
    
    const userInfo = data?.data || null;
    
    return (<UserInfoContext.Provider value={{userInfo, isLoading}}>
                <Outlet/>
            </UserInfoContext.Provider>)
}

export default AdminLayout