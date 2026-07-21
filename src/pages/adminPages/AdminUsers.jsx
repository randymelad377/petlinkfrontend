import Style from "./AdminUsers.module.css";
import SearchBar from "../../components/others/SearchBar";
import UserAvailable from "../../components/userComponents/AvailableUser";
import { useGet } from "../../helpers/PetHelper";
import { useEffect, useState } from "react";

function AdminUsers() {
    
    //FOR GET USERS
    const [searchUser, setSearchUser] = useState("");
    
    const [status, setStatus] = useState("active");
    const { data, error, isLoading } = useGet(`admin/users?${searchUser}&status=${status}`);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (data && !isLoading) {
            setUsers(data.data);
        }
    }, [data])
    //FOR GET USERS


    return (
        <main className={Style.mainAdminUsers}>
            <SearchBar status={status} setStatus={setStatus} setSearchUser={setSearchUser}></SearchBar>
            <UserAvailable users={users}></UserAvailable>
        </main>
    )
}

export default AdminUsers