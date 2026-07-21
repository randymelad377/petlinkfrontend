import { useContext, useEffect, useState } from "react";
import Style from "./Aside.module.css";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { usePost } from "../../../helpers/PetHelper";
import { UserInfoContext } from "../../../context/UserContext";

function SettingAside({showSetting, setShowSetting}) {
    
    const userContext = useContext(UserInfoContext);
    const isSuperAdmin = userContext?.userInfo?.role == "super_admin";

    const navigate = useNavigate();
    const { data, loading, error, isSuccess, execute } = usePost();
    function logout(){
        execute("user/logout", {});
        navigate("/login")
    }

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            {(width > 900 || showSetting) && (<aside className={Style.adminAside}>
                <ol className={Style.asideInnerContainer}>
                    <li onClick={() => setShowSetting(prev => !prev)}><NavLink to="/admin">Home</NavLink></li>
                    {isSuperAdmin && (<li onClick={() => setShowSetting(prev => !prev)}><NavLink to="/admin/setting/admins">Admins</NavLink></li>)}
                    <li onClick={() => setShowSetting(prev => !prev)}><NavLink to="/admin/setting">Personal Information</NavLink></li>
                    <li onClick={() => setShowSetting(prev => !prev)}><NavLink to="/admin/setting/change_password">Change Password</NavLink></li>
                    <li onClick={() => logout()}><NavLink>Logout</NavLink></li>
                </ol>
            </aside>)}
        </>
    )

}

export default SettingAside