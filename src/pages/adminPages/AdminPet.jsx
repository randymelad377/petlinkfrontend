import Style from "./AdminPet.module.css";
import Hero from "../../assets/signatureImg.png";
import { ImCross } from "react-icons/im";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillNotification } from "react-icons/ai";
import { IoMenu } from "react-icons/io5";
import { useGet, usePost, usePut } from "../../helpers/PetHelper"; 
import Modal from "../../components/others/Modal";
import PetHistory from "../../components/petComponents/PetHistory";

function AdminPet() {

    //function to convert key name into readable
    function convertKey(key) {
        return key.replace(/([A-Z])/g, " $1")
            .replace(/^./, char => char.toUpperCase());
    }

    const navigate = useNavigate();

    const param = useParams();

    const [openHistory, setOpenHistory] = useState(false);

    const petId = param.id;
    const { data, isLoading, error } = useGet(`admin/pets/get-pet/${petId}`);

    const [petInfo, setPetInfo] = useState({});
    const [petOwner, setPetOwner] = useState({});
    const [petQuestion, setPetQuestion] = useState([]);
    const [petTransactionInfo, setPetTransactionInfo] = useState({});
    const [petImages, setPetImages] = useState([]);
    const [transactionType, setTransactionType] = useState(0);
    const [petStatus, setPetStatus] = useState("");

    useEffect(() => {
        if (!isLoading) {
            setPetInfo(data?.data?.pet_info || {});
            setPetOwner(data?.data?.pet_owner || {});
            setPetQuestion(data?.data?.pet_questions || []);
            setPetTransactionInfo(data?.data?.pet_transaction_info || {});
            setPetImages(data?.data?.pet_images || []);
            setTransactionType(data?.data?.pet_others?.transaction_type_id || 0);
            setPetStatus(data?.data?.pet_others?.status || "tite");
        }
    }, [data]);

    //PET IMAGES SHOW
    const showPetImages = petImages.map((image, index) => (
        <img className={Style.petImages} src={image} alt="" key={index} />
    ));

    //PET INFO SHOW
    const showPetInfo = Object.entries(petInfo).map(([key, value], index) => {
        return (<div className={Style.infoInnerContainer} key={key}>
            <p className={Style.key}>{convertKey(key)}</p>
            <p className={Style.value}>{value}</p>
        </div>)
    });

    //TRANSACTION INFO SHOW
    const showTransactInfo = Object.entries(petTransactionInfo).map(([key, value]) => (
        <div className={Style.infoInnerContainer} key={key}>
            <p className={Style.key}>{convertKey(key)}</p>
            <p className={Style.value}>{value}</p>
        </div>
    ));

    //PET QUESTION SHOW
    const showQuestions = petQuestion.map((question, index) => (
        <div className={Style.inputInnerContainer} key={index}>
            <label className={Style.questionLabel}>Question {question.question_id}</label>
            <p className={Style.questionInput}>{question.question}</p>
        </div>
    ));

    
    const [showMenu, setShowMenu] = useState(false);
    const [show, setShow] = useState("petInfo");
    function toggleShow(show) {
        setShowMenu(prev => !prev);
        setShow(show);
    }

    const [confirmation, setConfirmation] = useState(false);
    const { data: dataUpdate, loading: loadingUpdate, error: errorUpdate, isSuccess: isSuccessUpdate, execute: executeUpdate } = usePut();
    const [decline, setDecline] = useState(false);
    const [deletePet, setDeletePet] = useState(false);

    const action = {
        "pending": "approve",
        "verified": "softDelete",
        "rehome": "softDelete",
        "found": "softDelete",
        "missing": "softDelete",
        "inTransaction": "cancelTransaction",
        "softDeleted": "delete"
    };

    function handleSubmit() {
        setConfirmation(false);

        let data = decline ? "decline" : action[petStatus];
        if (petStatus === "softDeleted") {
            data = deletePet ? "back" : action[petStatus];
        }
        executeUpdate(`admin/pets/modify-pet/${petId}`, {"action":data});

    }

    //SEND NOTIF TO PET
    const [message, setMessage] = useState("");
    const [count, setCount] = useState(0);
    const { data: dataSendNotif, loading: isLoadingSendNotif, error: errorSendNotif, isSuccess: isSuccessSendNotif, execute: executeSendNotif } = usePost();
    function handleSendNotif() {
        if (message.trim() === "") return;
        const formData = new FormData();
        formData.append("user_id", petOwner?.public_id);
        formData.append("pet_id", petId);
        formData.append("message", message);
        executeSendNotif(`admin/pets/send-pet-notif/`, formData);
    }
    useEffect(() => {
        if (count <= 0) return;

        const timer = setInterval(() => {
            setCount(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [count]);

    useEffect(() => {
        if (isSuccessSendNotif) {
            setCount(10);
            setMessage("");
        }
    }, [isSuccessSendNotif]);
    //SEND NOTIF TO PET

    if (isLoading) return "Loading...";

    return (
        <main className={Style.mainPetInfo}>
            <section className={Style.infoOuterContainer}>
                <div className={Style.userInfo}>
                    <img src={petOwner?.user_image || Hero} alt="" className={Style.userImage} />
                    <div className={Style.userInfoInnerContainer}>
                        <h2 className={Style.userName}>{petOwner?.user_name || "Pet Link"}</h2>
                        <IoMenu className={Style.messageIcon} onClick={() => setShowMenu(prev => !prev)}/>
                    { showMenu &&(<ol className={Style.settingContainer}>
                                        <li onClick={() => {toggleShow("sendNotif")}}>Send notification</li>
                                        <li onClick={() => {setShowMenu(prev => !prev); navigate("/admin/users/" + petOwner?.public_id)}}>View User</li>
                                        <li onClick={() => {toggleShow("petInfo")}}>View Pet Information</li>
                                        <li onClick={() => {toggleShow("petInfo"); setOpenHistory(true)}}>View History</li>
                                        {petQuestion.length !== 0 && (<li onClick={() => {toggleShow("petForm")}}>View Form</li>)}
                                    </ol>)
                    }
                    </div>
                </div>
                <div className={Style.imageContainer}>
                    {showPetImages}
                </div>

                {show === "petInfo" && (<>
                    <div className={Style.petInfoContainer}>
                        <div className={Style.infoInnerContainer}>
                            <p className={Style.key}>Pet Status</p>
                            <p className={Style.value}>{convertKey(petStatus)}</p>
                        </div>
                        {showPetInfo}
                    </div>
                    <div className={Style.transctionInfoContainer}>
                        {showTransactInfo}
                    </div>
                </>)}
                { show === "petForm"  && (<div className={Style.inputOuterContainer}>
                    {showQuestions}
                </div>)}

                {( show === "petForm" || show === "petInfo") && (<div className={Style.actionContainer}>
                    {petStatus === "pending" && (<button className={Style.submitButton} onClick={() => { setConfirmation(true);  setDecline(true)}}>Decline</button>)}
                    {petStatus === "softDeleted" && (<button className={Style.submitButton} onClick={() => { setConfirmation(true);  setDeletePet(true)}}>Back</button>)}
                    <button className={Style.submitButton} onClick={() => setConfirmation(true)}>{convertKey(petStatus ? action[petStatus] : "Loading")}</button>
                </div>)}

                {    
                    show === "sendNotif" && (<form className={Style.reportContainer}>
                                        <div className={Style.reportInnerContainer}>
                                            <textarea value={message} placeholder="Send Notification to user about this pet..." rows="5" onChange={(e) => setMessage(e.target.value)} className={Style.reportTextArea}/>
                                            <button disabled={count !== 0} type="button" className={Style.submitBtn} onClick={() => handleSendNotif()}>{count > 0 ? `Submit (${count}s)` : "Submit"}</button>
                                            {isLoadingSendNotif && <p style={{ color: "black", textAlign: "center" }}>Loading...</p>}
                                            {isSuccessSendNotif && <p style={{ color: "green", textAlign: "center" }}>{dataSendNotif?.message}</p>}
                                            {errorSendNotif && <p style={{ color: "red", textAlign: "center" }}>{errorSendNotif}</p>}
                                        </div>
                                    </form>)    
                }

                <Modal
                    handleSubmit={handleSubmit}
                    confirmation={confirmation}
                    confirmationMsg={petStatus === "softDeleted" ? "submit (Some user's history will be deleted too)": "submit" }
                    successMsg={dataUpdate?.message || "Pet Updated."}
                    loading={loadingUpdate}
                    success={isSuccessUpdate}
                    setConfirmation={setConfirmation}
                    goTo={"/admin"}
                />
            </section>
            
            {openHistory && (<PetHistory setOpenHistory={setOpenHistory} pet_id={petId} />)}
        </main>
    )
}

export default AdminPet