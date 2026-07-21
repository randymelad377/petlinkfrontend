import Style from "./Header.module.css";
import Hero from "../../../assets/signatureImg.png";
import { IoMdMenu } from "react-icons/io";
import { useEffect, useState } from "react";

function Header({setShowSetting, setShowSetting2}) {
    
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
        <header className={Style.adminHeader}>
            <section className={Style.leftSection}>
                <img src={Hero} alt="" className={Style.headerImg} />
                <h1 className={Style.title}>PETLINK</h1>
            </section>
           {width < 900 && ( <IoMdMenu onClick={() => {setShowSetting?.(prev => !prev);  setShowSetting2?.(prev => !prev)}} className={Style.menuIcon} />)}
        </header>
    )

}

export default Header