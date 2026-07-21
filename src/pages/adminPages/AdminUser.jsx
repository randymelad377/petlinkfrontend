import Style from "./AdminUser.module.css";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineMenu } from "react-icons/md";
import { MdArrowBack } from "react-icons/md";
import UserTransaction from "../../components/userComponents/UserTransactions";
import UserHistories from "../../components/userComponents/UserHistories";
import Hero from "../../assets/signatureImg.png";
import AvailablePet from "../../components/petComponents/AvailablePet";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useGet, usePost, usePut } from "../../helpers/PetHelper";
import Modal from "../../components/others/Modal";
import PageLoading from "../../components/feedbackComponents/PageLoading";
import PageError from "../../components/feedbackComponents/PageErrorInside";
import { UserInfoContext } from "../../context/UserContext";
function AdminUser() {

    const userContext = useContext(UserInfoContext);
    const isSuperAdmin = userContext?.userInfo?.role == "super_admin";

    const navigate = useNavigate();
    const [showSetting, setShowSetting] = useState(false);
    const [showWhat, setShowWhat] = useState("userInfo");
    
    //function to convert key name into readable
    function convertKey(key) {
        return key.replace(/([A-Z])/g, " $1")
                  .replace(/^./, char => char.toUpperCase());
    }

    //pet basic info && GET USER API
    const param = useParams().id;
    const [petType, setPetType] = useState("rehome");
    const { data, error, isLoading } = useGet(`admin/users/${param}?status=${petType}`);
    const [userInfo, setUserInfo] = useState({});
    const [pets, setPets] = useState([]);
    
    useEffect(() => {
        if (data && !isLoading) {
            setUserInfo(data?.data?.user_info);
            setPets(data?.data?.user_pets);
        }
    }, [data, isLoading])
    
    const showUserInfo = Object.entries(userInfo).filter(([key, value]) => key !== "id" && key !== "image").map(([key, value]) => (
        <div key={key} className={Style.infoInnerContainer}>
            <p className={Style.key}>{convertKey(key)}</p>
            <p className={Style.value}>{value}</p>
        </div>
    ));
    //pet basic info && GET USER API


    //SEND NOTIFICATION TO USER
    const [message, setMessage] = useState("");
    const [count, setCount] = useState(0);
    const { data: dataSendNotif, loading: isLoadingSendNotif, error: errorSendNotif, isSuccess: isSuccessSendNotif, execute: executeSendNotif } = usePost();
    function handleSendNotif() {
        if (message.trim() == "") return;
        const formData = new FormData();
        formData.append("user_id", param);
        formData.append("message", message);
        executeSendNotif(`admin/users/`, formData);
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
    //SEND NOTIFICATION TO USER

    const [confirmation, setConfirmation] = useState(false);
    const [isAccountAction, setIsAccountAction] = useState(true);

    //Account action api
    const [action, setAction] = useState("");
    const { data:updateData, loading:updateLoading, error:updateError, isSuccess:updateIsSuccess, execute:updateExecute } = usePut();
    function handleSubmit() {
        setConfirmation(false);
        
        updateExecute(`user/account-action`, {"user_id": param, "action" : action});
    }
    //Account action api

    //Promote action api
    const { data:promoteData, loading:promoteLoading, error:promoteUpdate, isSuccess:promoteIsSuccess, execute:promoteExecute } = usePut();
    function handlePromote() {
        setConfirmation(false);
        const actionPromote = userInfo?.role === "user" ? 1 : 0;
        promoteExecute(`admin/user/promote-user`, {"user_id": param, "action" : actionPromote});
    }
    //Promote action api
    
    //FOR TRANSACTION AND HISTORY
    const [showTransactions, setShowTransaction] = useState(false);
    const [showHistories, setShowHistories] = useState(false);
    //FOR TRANSACTION AND HISTORY

    if (isLoading) return <PageLoading />;
    if (error) return <PageError error={error}/>;
    return (
        <main className={Style.mainUserInfo} >
            <section className={Style.outerInfoContainer}>
                <MdArrowBack onClick={() => navigate(-1)}></MdArrowBack>
                <div className={Style.imageContainer}>
                    <img src={userInfo?.image || Hero} alt="" className={Style.userImage} />
                    <h2 className={Style.userName}>{userInfo.firstName + " " + userInfo.lastName}</h2>
                </div>
                <MdOutlineMenu onClick={() => setShowSetting(prev => !prev)}></MdOutlineMenu>
                
                { showSetting &&(<ol className={Style.settingContainer}>
                                    <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("sendNotif")}}>Send Notification</li>
                                    {isSuperAdmin && (<li onClick={() => {setShowSetting(prev => !prev); setConfirmation(true); setIsAccountAction(false)}}>{userInfo?.role === "admin" ? "Demote to user" : "Promote to admin"}</li>)}
                                    <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("userInfo")}}>Personal Information</li>
                                    {(userInfo?.role === "user") && (<>
                                        {userInfo?.status === "active" && (<li onClick={() => {setShowSetting(prev => !prev); setAction("ban"); setConfirmation(true);setIsAccountAction(true)}}>Ban</li>)}
                                        {userInfo?.status === "banned" &&(<li onClick={() => {setShowSetting(prev => !prev); setAction("re-activate"); setConfirmation(true); setIsAccountAction(true)}}>Unban</li>)}
                                        {userInfo?.status === "active" && (<li onClick={() => {setShowSetting(prev => !prev); setAction("suspend"); setConfirmation(true); setIsAccountAction(true)}}>Suspend</li>)}
                                        {userInfo?.status === "suspend" &&(<li onClick={() => {setShowSetting(prev => !prev); setAction("re-activate"); setConfirmation(true); setIsAccountAction(true)}}>Unsuspend</li>)}
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowTransaction(true)}}>Transactions</li>
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowHistories(true)}}>Histories</li>
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("userPets"); setPetType("pending")}}>Pending Pets</li>
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("userPets"); setPetType("verified")}}>Verified Pets</li>
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("userPets"); setPetType("rehome")}}>Pet to rehome</li>
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("userPets"); setPetType("found")}}>Found Pet</li>
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("userPets"); setPetType("missing")}}>Missing Pet</li>
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("userPets"); setPetType("softDeleted")}}>Deleted Pets</li>
                                        <li onClick={() => {setShowSetting(prev => !prev); setShowWhat("userPets"); setPetType("inTransaction")}}>In Transaction</li>
                                    </>)}
                                </ol>)
                }
            </section>
            {showWhat === "userPets" && (<AvailablePet goto={"/admin/pets"} pets={pets}></AvailablePet>)}
            {showWhat === "userInfo" && (
                <section className={Style.userInfoContainer}>
                    {showUserInfo}
                </section>
            )}
            {
                
                showWhat === "sendNotif" && (<form className={Style.reportContainer}>
                                    <div className={Style.reportInnerContainer}>
                                        <textarea value={message}onChange={(e) => setMessage(e.target.value)} placeholder="Once notification is sent, admin cannot undo it." rows="5" className={Style.reportTextArea}/>
                                        <button disabled={count !== 0} type="button" className={Style.submitBtn} onClick={() => handleSendNotif()}>{count > 0 ? `Submit (${count}s)` : "Submit"}</button>
                                        {isLoadingSendNotif && <p style={{ color: "black", textAlign: "center" }}>Loading...</p>}
                                        {isSuccessSendNotif && <p style={{ color: "green", textAlign: "center" }}>{dataSendNotif?.message}</p>}
                                        {errorSendNotif && <p style={{ color: "red", textAlign: "center" }}>{errorSendNotif}</p>}
                                    </div>
                                </form>)    
            }
            {showTransactions && (<UserTransaction setShowTransaction={setShowTransaction} id={param}></UserTransaction>)}
            {showHistories && (<UserHistories setShowHistories={setShowHistories} id={param}></UserHistories>)}
             <Modal
                handleSubmit={isAccountAction ? handleSubmit : handlePromote}
                confirmation={confirmation}
                confirmationMsg={isAccountAction ? action + " this user" : userInfo?.role === "user" ? "Promote this user to admin" : "Demote this user to admin"}
                successMsg={isAccountAction ? updateData?.message : promoteData?.message}
                loading={isAccountAction ? updateLoading : promoteLoading}
                success={isAccountAction ? updateIsSuccess : promoteIsSuccess}
                setConfirmation={setConfirmation}
                goTo={"/admin/users"}
            ></Modal>
        </main>
    )
}

export default AdminUser