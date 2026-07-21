import Style from "./AdminPets.module.css";
import SearchBar from "../../components/others/SearchBar";
import AvailablePet from "../../components/petComponents/AvailablePet";
import { useGet } from "../../helpers/PetHelper";
import { useEffect, useState } from "react";

function AdminPets() {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(`status=pending`);

    const { data, isLoading, error } = useGet(`admin/pets/get-pets?${status}&${search}`);
 
    return (
        <main className={Style.mainAdminPets}>
            <SearchBar search={search} setSearch={setSearch} status={status} setStatus={setStatus}/>
            <AvailablePet goTo="/admin/pets" pets={data?.data} loading={isLoading}></AvailablePet>
        </main>
    )
}

export default AdminPets