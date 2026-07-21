import Style from "./Notification.module.css";
import Hero from "../../assets/signatureImg.png";
import { MdDeleteOutline } from "react-icons/md";
import { useDelete, useGet, usePut } from "../../helpers/PetHelper";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
function Notifications() {
    
    const navigate = useNavigate();

    //get data from api
    const { data, error, isLoading } = useGet("notifications");
    const [ notifications, setNotifications ] = useState([]);
    useEffect(() => {
        if (!isLoading) {
            setNotifications(data?.data || []);
        }
    }, [data, isLoading])

    //FOR UPDATE
    const { data:dataUpdate, loading:loadingUpdate, error:errorUpdate, isSuccess:isSuccessUpdate, execute } = usePut();
    function handleSubmit(id) {
        const formData = new FormData();
        setShowMenuID("");
        execute(`notifications/${id}`, formData);
    }

    useEffect(() => {
        if (isSuccessUpdate && !loadingUpdate) {
            setNotifications(dataUpdate?.data || []);
        }
    }, [dataUpdate, loadingUpdate])
    //FOR UPDATE

    //FOR DELETE
    const { data:dataDelete, loading:dataLoading, error:dataError, isSuccess:dataIsSuccess, execute:dataExecute } = useDelete();
    function handleDelete(id) {
        dataExecute(`notifications/${id}`);
    }
        useEffect(() => {
        if (dataIsSuccess && !dataLoading) {
            setNotifications(dataDelete?.data || []);
        }
    }, [dataDelete, dataLoading])
    //FOR DELETE

    //for nav path 
    const navPath = {
        "acceptForm": "/transaction/",
        "markAs": "/transaction/",
        "requestForm" : "/request_forms/",
        "newVerifiedPet": "/pets/",
        "modifyPet": "/pets/update/",
        "adminSendPet": "/pets/update/"
    }

    function navFunc(notif) {
        const title = notif.title;
        const object_id = notif.object_id;

        if (title === "markAs" && notif?.haveHistory) {
            return navigate("/history/" + object_id);
        } else if (title === "adminSend") {
            return;
        }
        navigate(navPath[title] + object_id);
    }

    //show
    const [activeButton, setActiveButton] = useState(true);
    const [showMenuID, setShowMenuID] = useState("");
    const showNotifications = notifications?.length > 0 ? notifications?.filter((notif) => activeButton || !notif.isRead).map((notif) => (
        <article className={Style.NotifInnerContainer} key={notif.id}>
            <img src={notif.image} alt="" />
            <p onClick={() => navFunc(notif)}>{notif.message}</p>
            <div className={Style.menuOC}>
                <BsThreeDots onClick={() => setShowMenuID(prev => prev === notif.id ? "" : notif.id)}/>
                {showMenuID === notif.id && (<ol className={Style.menuIC}>
                    <li onClick={() => handleDelete(notif.id)}>Delete</li>
                    <li onClick={() => handleSubmit(notif.id)}>{notif.isRead ? "Mark as unread" : "Mark as read"}</li>
                </ol>)}
            </div>
        </article>
    )) : <p>No notifications.</p>

    return (
        <main className={Style.mainNotfication}>
            <section className={Style.sectionButtonContainer}>
                <button onClick={() => setActiveButton(true)} className={activeButton ? Style.activeButton : Style.notActiveButton}>All</button>
                <button onClick={() => setActiveButton(false)} className={!activeButton ? Style.activeButton : Style.notActiveButton}>Unread</button>
            </section>
            <section className={Style.NotifOuterContainer}>
                {showNotifications}
            </section>
        </main>
    )

}

export default Notifications