import { Outlet } from "react-router-dom";
import Header from "../components/semantics/Header";

function SettingLayout() {
    return (
        <div className="layout" id="settingLayout">
            <Outlet></Outlet>
        </div>
    )
}

export default SettingLayout