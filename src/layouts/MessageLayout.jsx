import { Outlet } from "react-router-dom";

function MessageLayout() {
    return (
        <div className="layout">
            <Outlet></Outlet>
        </div>
    )
}

export default MessageLayout