import { useEffect, useState } from "react";
import Style from "./Aside.module.css";
import { NavLink } from "react-router-dom";
function Aside({showSetting, setShowSetting}) {
    
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
            {(showSetting || width > 900) && (<aside className={Style.adminAside}>
                <ol className={Style.asideInnerContainer}>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin">Home</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin/pets">Pets</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin/users">Users</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin/notifications">Notifications</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin/feedbacks">Feedback</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin/reports">Reports</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin/restriction">Restrictions</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin/map">Map</NavLink></li>
                    <li onClick={() => setShowSetting(false)}><NavLink to="/admin/setting">Settings</NavLink></li>
                </ol>
            </aside>)}
        </>
    )

}

export default Aside