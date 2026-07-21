import { useEffect, useState } from "react";
import Style from "./Setting.module.css";
import { Outlet, NavLink, useLocation} from "react-router-dom";
import { usePost } from "../../helpers/PetHelper";
import { IoMdMenu } from "react-icons/io";
function Setting() {

    const pathName = useLocation().pathname;
    const content = (() => {
        switch (pathName) {
            case "/setting/blocked_users": return "Blocked Users";
            case "/setting/change_password": return "Change Password";
            case "/setting/history": return "History";
            case "/setting/request_forms": return "Request Forms";
            case "/setting/concern": return "Concern";
            case "/setting/transactions": return "Transaction";
            case "/setting/pets": return "Pets";
            default: return "Personal Information";
        }
    })();
    
    const { data, loading, error, isSuccess, execute } = usePost();
    function logout(){
        execute("user/logout", {});
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

    const [showSetting, setShowSetting] = useState(false);
    
    return (
        <main className={Style.mainSetting}>
            {(showSetting || width > 900) && (<section className={Style.menuContainer}>
                <h2>Setting</h2>

                <ol>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/setting">Personal Information</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/setting/pets">Your Pets</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/setting/request_forms">Request Forms</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/setting/transactions">Transactions</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/setting/history">History</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/setting/blocked_users">Blocked Users</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/setting/change_password">Change Password</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/setting/concern">Send Concern</NavLink></li>
                    <li onClick={() => logout()}><NavLink to="/login">Logout</NavLink></li>
                </ol>
            </section>)}
            <section className={Style.menuContentContainer}>
                <div className={Style.menuIconContainer}>
                    <h2>{content}</h2>
                    <IoMdMenu onClick={() => setShowSetting(prev => !prev)}></IoMdMenu>
                </div>
                <hr />
                <Outlet></Outlet>
            </section>
        </main>
    )

}

export default Setting