import Style from "./User.module.css";
import Hero from "../../assets/signatureImg.png";

import AvailableUser from "../../components/userComponents/AvailableUser";
import SearchBar from "../../components/others/SearchBar";
import { useGet } from "../../helpers/AuthHelper";
import { useEffect, useState } from "react"; 
function User() {

    const [searchUser, setSearchUser] = useState("");
    const { data, error, isLoading } = useGet(`user/getUsers?${searchUser}`);
    
    return (
        <main className={Style.mainUser}>
            <SearchBar setSearchUser={setSearchUser}></SearchBar>
            <AvailableUser users={data?.data}></AvailableUser>
        </main>
    );
}

export default User;