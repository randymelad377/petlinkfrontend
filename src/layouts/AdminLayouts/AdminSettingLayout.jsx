import Style from "./Admin.module.css";
import Header from "../../components/adminComponents/semantic/Header";
import SettingAside from "../../components/adminComponents/semantic/SettingAside";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function AdminSettingLayout() {

    const [showSetting2, setShowSetting2] = useState(false);

    return (
        <div className={Style.adminDashboardLayout}>
            <Header setShowSetting={setShowSetting2}></Header>
            <div className={Style.innerContainer}>
                <SettingAside showSetting={showSetting2} setShowSetting={setShowSetting2}></SettingAside>
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default AdminSettingLayout