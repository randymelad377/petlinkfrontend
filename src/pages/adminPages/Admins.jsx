import Style from "./AdminUsers.module.css";
import SearchBar from "../../components/others/SearchBar";
import AvailableUser from "../../components/userComponents/AvailableUser";
import { useGet } from "../../helpers/PetHelper";
import { useEffect, useState } from "react";

function Admins() {
    const { data, error, isLoading } = useGet("admin/user/get-admins");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (data && !isLoading) {
            setUsers(data?.data);
        }
    });

    return (
        <main className={Style.mainAdminUsers}>
            <AvailableUser users={users} path={"/admin/users/"}></AvailableUser>
        </main>
    )
}

export default Admins