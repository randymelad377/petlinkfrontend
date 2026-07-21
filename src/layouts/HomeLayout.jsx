import { Outlet } from "react-router-dom";
import Header from "../components/semantics/Header";
import Footer from "../components/semantics/Footer";

function HomeLayout() {

    return (
        <div className="layout">
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    )
}

export default HomeLayout