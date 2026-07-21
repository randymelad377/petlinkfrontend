import Style from "./AdminMap.module.css";
import Map from "../../components/map/Map";
import { useDelete, useGet, usePost, usePut } from "../../helpers/PetHelper";
import { useEffect, useState } from "react";
import Modal from "../../components/others/Modal";

function AdminMap() {

    const { data: clinicData, isLoading: clinicIsLoading, error: clinicError } = useGet("clinic");
    const [clinics, setClinics] = useState([]);
    useEffect(() => { if (clinicData && !clinicIsLoading) { setClinics(clinicData?.data) } }, [clinicData, clinicIsLoading]);

    const [isUpdate, setIsUpdate] = useState(true);

    const [confirmation, setConfirmation] = useState(false);
    const [clinic, setClinic] = useState({});
    const { data:dataUpdate, loading, error, isSuccess, execute } = usePut();
    function handleSubmit() {
        setConfirmation(false)
        const data = {
            "clinic_name" : clinic.clinic_name,
            "latitude" : clinic.coord[0],
            "longitude" : clinic.coord[1],
            "isOpen" : clinic.isOpen == "Open" ? 1 : 0,
        }
        execute(`clinic/${clinic.id}`, data);
    }

    useEffect(() => {
        if (dataUpdate && loading) {
            setClinics(dataUpdate?.data);
        }
    }, [dataUpdate, loading])

    const showClinics = clinics.map((clinicParam) => {
        return (
            <li  className={Style.clinicIC}>
                <ol className={Style.clinicInnerOl} key={clinicParam.id}>
                    <li><input disabled={clinic.id !== clinicParam.id} onChange={e => setClinic(prev => ({ ...prev, clinic_name: e.target.value }))} type="text" defaultValue={clinicParam.clinic_name} /></li>
                    <li><input disabled={clinic.id !== clinicParam.id} onChange={e => setClinic(prev => ({ ...prev, coord: [e.target.value, prev.coord[1]] }))} type="text" defaultValue={clinicParam.coord[0]} /></li>
                    <li><input disabled={clinic.id !== clinicParam.id} onChange={e => setClinic(prev => ({ ...prev, coord: [prev.coord[0], e.target.value] }))} type="text" defaultValue={clinicParam.coord[1]} /></li>
                    <li><input disabled={clinic.id !== clinicParam.id} onChange={e => setClinic(prev => ({ ...prev, isOpen: e.target.value }))} type="text" defaultValue={clinicParam.isOpen ? "Open" : "Close"} /></li>
                    {clinic.id !== clinicParam.id && (<li><button onClick={() => setClinic(clinicParam)}>Edit</button></li>)}
                    {clinic.id === clinicParam.id && (<li><button onClick={() => { setConfirmation(true); setIsUpdate(true)}}>Update</button></li>)}
                    <li><button onClick={() => {setClinic(clinicParam), setConfirmation(true); setIsUpdate(false)}}>Delete</button></li>
                </ol>
            </li>
        )
    });
    
    const { data:dataDelete, loading:dataLoading, error:dataError, isSuccess:dataIsSuccess, execute:dataExecute } = useDelete();
    function handleDelete() {
        setConfirmation(false);
        dataExecute(`clinic/${clinic.id}`);
    }
    
    useEffect(() => {
        if (dataDelete && !dataLoading) {
            setClinics(dataDelete?.data || []);
        }
    }, [dataDelete, dataLoading]);


    const [newClinicName, setNewClinicName] = useState("");
    const [newClinicLatitude, setNewClinicLatitude] = useState("");
    const [newClinicLongitude, setNewClinicLongitude] = useState("");

    const { data: postData, loading: postLoading, error:postError, isSuccess: postIsSuccess, execute:postExecute } = usePost();
    function handleStore() {
        
        if (newClinicName === "" || newClinicLatitude === "" || newClinicLongitude === "") {
            return;
        }

        const formData = new FormData();
        formData.append("clinic_name", newClinicName);
        formData.append("latitude", newClinicLatitude);
        formData.append("longitude", newClinicLongitude);
        postExecute("clinic", formData);
    }

    useEffect(() => {
        if (postData && !postLoading) {
            setClinics(postData?.data || []);
        }
    }, [postData, postLoading]);

    return (
        <main className={Style.mapMain}>
            <ol className={Style.clinicsOC}>
                <li className={Style.clinicIC}>
                    <ol className={Style.clinicInnerOl}>
                        <li style={{textAlign:"center", fontWeight:"bold"}}>Clinic Name</li>
                        <li>Latitude</li>
                        <li>Longitude</li>
                        <li>Status</li>
                        <li>Update</li>
                        <li>Delete</li>
                    </ol>
                </li>
                {showClinics}
                <li  className={Style.clinicIC}>
                <ol className={Style.clinicInnerOl} key={0}>
                    <li><input onChange={e => setNewClinicName(e.target.value)} placeholder="Clinic Name" type="text" value={newClinicName} /></li>
                    <li><input onChange={e => setNewClinicLatitude(e.target.value)} placeholder="Clinic Latitude" type="text" value={newClinicLatitude} /></li>
                    <li><input onChange={e => setNewClinicLongitude(e.target.value)} placeholder="Clinic Longitude" type="text" value={newClinicLongitude}/></li>

                    <li><button onClick={() => handleStore()} style={{backgroundColor:"green"}}>Add</button></li>
                </ol>
            </li>
            </ol>
            <Map clinics={clinics}></Map>

            <Modal
                handleSubmit={isUpdate ? handleSubmit : handleDelete}
                confirmation={confirmation}
                confirmationMsg={isUpdate ? "update" : "delete (cannot undo)"}
                successMsg={isUpdate ? clinicData?.message : dataDelete?.message}
                loading={isUpdate ? loading : dataLoading}
                success={false}
                setConfirmation={setConfirmation}
                goTo={""}
                buttonBackName="Back"
            ></Modal>
        </main>
    )
}

export default AdminMap