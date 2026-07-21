import { Outlet } from "react-router-dom";

function NotificationLayout() {
    return (
        <div className="layout">
            <Outlet></Outlet>
        </div>
    )
}

export default NotificationLayout