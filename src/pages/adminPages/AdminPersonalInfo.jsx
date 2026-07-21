import { useEffect, useState } from "react";
import Style from "./AdminPersonalInfo.module.css";
import { FaEdit } from "react-icons/fa";
import { MdOutlineSaveAlt } from "react-icons/md";
import Hero from "../../assets/signatureImg.png";
import { UserInfoContext } from "../../context/UserContext";
import { useContext } from "react";
import { usePut } from "../../helpers/PetHelper";
import Modal from "../../components/others/Modal";

function AdminPersonalInfo() {

    const userContext = useContext(UserInfoContext);
    const user = userContext.userInfo;
    const [php, setPhp] = useState(null);
    
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        age: "",
        houseNumber: "",
        street: "",
        barangay: "",
        municipality: "",
        email: "",
        contactNumber: "",
        username: "",
        image: "",
        _method: "PUT"
    });

    useEffect(() => {
        setFormData({
            firstName: user?.firstName || "",
            middleName: user?.middleName || "",
            lastName: user?.lastName || "",
            gender: user?.gender || "",
            age: user?.age || "",
            houseNumber: user?.houseNumber || "",
            street: user?.street || "",
            barangay: user?.barangay || "",
            municipality: user?.municipality || "Tuguegarao City",
            email: user?.email || "",
            contactNumber: user?.contactNumber || "",
            username: user?.username || "",
            image: user?.image || null,
            _method: "PUT"         
        })
         
        setPhp(user?.image || null);
    },[user])

    const [allowEdit, setAllowEdit] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    
    const [confirmation, setConfirmation] = useState(false);
    
    const { data, loading, error, execute } = usePut();
    const [isSuccess, setIsSuccess] = useState(false);

    function handleSubmit() {
        setConfirmation(false);
        const payload = {
            ...formData,
            image: typeof formData.image === "string" ? "" : formData.image
        };

        execute("user/update", payload);
    }

    useEffect(() => {
        if (data) {
            setIsSuccess(true);
        }
    }, [data, error])

    return(
        <main className={Style.sectionInfo}>
            <img src={php|| Hero} alt="" className={Style.img}/>

            <form className={Style.infoContainer}>

                <div className={Style.innerContainer}>
                    <input type="text" name="firstName" placeholder="First Name" value={formData?.firstName} onChange={handleChange} disabled={!allowEdit}/>
                    <input type="text" name="middleName" placeholder="Middle Name" value={formData?.middleName} onChange={handleChange} disabled={!allowEdit}/>
                    <input type="text" name="lastName" placeholder="Last Name" value={formData?.lastName} onChange={handleChange} disabled={!allowEdit}/>
                </div>

                <div className={Style.innerContainer}>
                    <input type="email" name="email" placeholder="Email" value={formData?.email} onChange={handleChange} disabled={!allowEdit}/>
                    <input type="number" name="contactNumber" placeholder="Contact Number" value={formData?.contactNumber} onChange={handleChange} disabled={!allowEdit}/>
                    <input type="text" name="username" placeholder="Username" value={formData?.username} onChange={handleChange} disabled={!allowEdit}/>
                </div>

                <div className={Style.innerContainer}>
                    <input type="text" name="gender" placeholder="Gender" value={formData?.gender} onChange={handleChange} disabled={!allowEdit}/>
                    <input type="text" name="age" placeholder="Age" value={formData?.age} onChange={handleChange} disabled={!allowEdit}/>
                </div>

                <div className={Style.innerContainer}>
                    <input type="text" name="houseNumber" placeholder="House Number" value={formData?.houseNumber} onChange={handleChange} disabled={!allowEdit}/>
                    <input type="text" name="street" placeholder="Street" value={formData?.street} onChange={handleChange} disabled={!allowEdit}/>
                </div>

                <div className={Style.innerContainer}>
                    <input type="text" name="barangay" placeholder="Barangay" value={formData?.barangay} onChange={handleChange} disabled={!allowEdit}/>
                    <input type="text" name="municipality" placeholder="Municipality" value={formData?.municipality} onChange={handleChange} disabled={false} />
                </div>

                {allowEdit && (
                    <div className={Style.inputImageContainer}>
                        <label>Select Profile Image</label>
                        <input type="file" accept=".png, .jpg, .jpeg" name="image" onChange={(e) => {
                                                                                                setFormData({
                                                                                                    ...formData,
                                                                                                    image: e.target.files[0]
                                                                                                });
                                                                                            }} />
                    </div>
                )}

                {error && (<p style={{ color: "red", textAlign: "center" }}>{error}</p>)}
                
                <div className={Style.actionContainer}>
                    {!allowEdit && (
                        <button type="button" onClick={() => setAllowEdit(true)}>
                            <FaEdit />
                            Edit
                        </button>
                    )}


                    {allowEdit && (
                        <button type="button" onClick={() => setConfirmation(true)}>
                            <MdOutlineSaveAlt />
                            Save
                        </button>
                    )}
                </div>

                <Modal
                    handleSubmit={handleSubmit}
                    confirmation={confirmation}
                    confirmationMsg={"submit"}
                    successMsg={data?.message}
                    loading={loading}
                    success={isSuccess}
                    setConfirmation={setConfirmation}
                    goTo={"/admin"}
                ></Modal>
                
            </form>
        </main>
    );
}

export default AdminPersonalInfo;