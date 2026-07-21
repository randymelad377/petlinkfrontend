import { Outlet } from "react-router-dom";
import Footer from "../components/semantics/Footer";
import Header from "../components/semantics/Header";

function UsersLayout() {
    return (
        <div className="layout">
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    )
}

export default UsersLayout