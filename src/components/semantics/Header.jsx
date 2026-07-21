import Style from "./Header.module.css";
import Hero from "../../assets/signatureImg.png";
import { IoMenu } from "react-icons/io5";
import { CgMenuGridO } from "react-icons/cg";
import { FaBox } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { RiUserSearchLine } from "react-icons/ri";
import { LuMessageCircle } from "react-icons/lu";
import { LuLogIn } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BsSearchHeartFill } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../../context/UserContext";


function Header(){

    const location = useLocation();
    const [showHeader, setShowHeader] = useState(false);
    const userInfo = useContext(UserInfoContext);
    const [allowGo, setAllowGo] = useState();
    const navigate = useNavigate();
    
    useEffect(() => {
        setAllowGo(userInfo?.userInfo ? true : false);
    }, [userInfo?.userInfo])

    return (
        <header className={Style.userHeader}>
            <section className={Style.leftSection} onClick={() => navigate("/")}>
                <img src={Hero} alt="" className={Style.headerImg} />
                <h1 className={Style.title}>PETLINK</h1>
            </section>
            <ol className={Style.centerSection}>
                <li><NavLink to="/"><IoHomeOutline/></NavLink></li>
                <li><NavLink to="/pets"><CgMenuGridO/></NavLink></li>
                <li><NavLink to="/users"><RiUserSearchLine/></NavLink></li>
                <li><NavLink style={allowGo ? {} : { cursor: "not-allowed" } } to={allowGo ? "/messages" : location.pathname}><LuMessageCircle/></NavLink></li>
                <li><NavLink style={allowGo ? {} : { cursor: "not-allowed" } } to={allowGo ? "/notifications" : location.pathname}><IoMdNotificationsOutline/></NavLink></li>
                <li><NavLink style={allowGo ? {} : { cursor: "not-allowed" } } to={allowGo ? "/setting" : location.pathname}><IoSettingsOutline/></NavLink></li>
                {!allowGo && (<li><NavLink to="/login"><LuLogIn/></NavLink></li>)}
            </ol>
            <section className={Style.rightSection}>
                <IoMenu className={Style.menu} onClick={() => setShowHeader(true)}></IoMenu>
            </section>

            {
                showHeader && (
                    <ol className={Style.toggleSectionContainer}>
                        <li onClick={() => setShowHeader(false)}><ImCross/></li>
                        <li><NavLink onClick={() => setShowHeader(false)}to="/">Home</NavLink></li>
                        <li><NavLink onClick={() => setShowHeader(false)}to="pets">Pets</NavLink></li>
                        <li><NavLink onClick={() => setShowHeader(false)}to="/users">Users</NavLink></li>
                        <li><NavLink onClick={() => setShowHeader(false)}to="/messages">Message</NavLink></li>
                        <li><NavLink onClick={() => setShowHeader(false)}to="/notifications">Notifications</NavLink></li>
                        <li><NavLink onClick={() => setShowHeader(false)}to="/setting">Setting</NavLink></li>
                    </ol>
                )
            }
        </header>
    )
}

export default Header