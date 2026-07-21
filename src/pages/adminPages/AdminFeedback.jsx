import Style from "./AdminNotification.module.css";
import Hero from "../../assets/signatureImg.png";
import { MdDeleteOutline } from "react-icons/md";
import ModalFeedback from "../../components/adminComponents/notification/ModalFeedback";
import { useEffect, useState } from "react";
import { useDelete, useGet } from "../../helpers/PetHelper";

function AdminFeedback() {
    
    const [showFeedback, setShowFeedback] = useState(false);
    const [activeButton, setActiveButton] = useState(false);

    //Api
    const [concerns, setConcerns] = useState([]);
    const [concern, setConcern] = useState({});

    const { data, error, isLoading } = useGet(`concerns`);
    useEffect(() => {
        if (!isLoading) {
            setConcerns(data?.data || []);
        }
    }, [data, isLoading])
    //Api

    function setConcernFunc(concern) {
        setConcern(
            {
                "id": concern.concern_id,
                "user_id" : concern.user_id,
                "user_image" : concern.user_image,
                "user_name": concern.user_name,
                "image": concern.image,
                "message" : concern.message
            }
        )
    }


    const showConcerns = concerns?.length > 0 ? concerns.filter((concern) => activeButton || !concern.isRead).map((concern, index) => (
        <article key={index} className={Style.NotifInnerContainer} onClick={() => setShowFeedback(true)} onClickCapture={() => setConcernFunc(concern)}>
            <img src={concern.user_image || Hero} alt="" />
            <p>{concern.user_name} <span>{concern.message ? concern.message.slice(0, 10) + "..." :  "no messages..."}</span> </p>
        </article>
    )) : <p>No Feedback yet.</p>
    
    return (
    <main className={Style.mainNotfication}>
        <section className={Style.sectionButtonContainer}>
            <button onClick={() => setActiveButton(true)} className={activeButton ? Style.activeButton : Style.notActiveButton}>All</button>
            <button onClick={() => setActiveButton(false)} className={!activeButton ? Style.activeButton : Style.notActiveButton}>Unread</button>
        </section>
        <section className={Style.NotifOuterContainer}>
            {showConcerns}
        </section>
            {showFeedback && (<ModalFeedback setShowFeedback={setShowFeedback} data={concern} setConcerns={setConcerns} />)}
    </main>
    )

}

export default AdminFeedback