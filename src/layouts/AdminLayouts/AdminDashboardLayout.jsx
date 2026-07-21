import { Outlet } from "react-router-dom"
import Header from "../../components/adminComponents/semantic/Header";
import Aside from "../../components/adminComponents/semantic/Aside";
import Style from "./Admin.module.css";
import { useState } from "react";

function AdminDashboardLayout() {
    const [showSetting, setShowSetting] = useState(false);
    return (
        <div className={Style.adminDashboardLayout}>
            <Header setShowSetting={setShowSetting}></Header>
            <div className={Style.innerContainer}>
                <Aside showSetting={showSetting} setShowSetting={setShowSetting}></Aside>
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default AdminDashboardLayout