import Style from "./UserPets.module.css";
import AvailablePet from "../petComponents/AvailablePet";
import { MdMenu } from "react-icons/md";
import { useEffect, useState } from "react";
import { useGet } from "../../helpers/PetHelper";

function UserPets() {
    
    const [showSetting, setShowSetting] = useState(false);
    const [status, setStatus] = useState("pending");
    const { data, isLoading, error } = useGet(`user/my-pets?status=${status}`);
    const [pets, setPets] = useState([]);

    const toggleStatus = (status) => {
        setShowSetting(false);
        setStatus(status)
    }

    useEffect(() => {
        if (!isLoading) {
            setPets(data?.data);
        }
    }, [data]);

    return (
        <>
            <section className={Style.menuContainer}>
                <MdMenu onClick={() => setShowSetting(prev => !prev)} className={Style.menuIcon}></MdMenu>
                { showSetting && (<ol>
                    <li onClick={() => toggleStatus("verified")}>Not Available Pets</li>
                    <li onClick={() => toggleStatus("rehome")}>Pet to Rehome</li>
                    <li onClick={() => toggleStatus("missing")}>Missing Pet</li>
                    <li onClick={() => toggleStatus("found")}>Found Pet </li>
                    <li onClick={() => toggleStatus("inTransaction")}>In Transaction Pet </li>
                    <li onClick={() => toggleStatus("pending")}>Pending </li>
                </ol>)}
            </section>
            <AvailablePet goto="/pets/update" pets={pets} loading={isLoading}/>
        </>
    )

}

export default UserPets