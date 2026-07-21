import Style from "./History.module.css";
import Hero from "../../assets/signatureImg.png";
import { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGet, useDelete } from "../../helpers/PetHelper";
import Modal from "../others/Modal";

function BlockedUsers() {
    
    const navigate = useNavigate();

    const { data, error, isLoading } = useGet("block");
    const [blockedUsers, setBlockedUsers] = useState([]);

    useEffect(() => {
        if (data && !isLoading) {
            setBlockedUsers(data.data);
        }
    }, [data, isLoading])
    
    //api
    const { data: dataDelete, loading: dataLoading, error: dataError, isSuccess: dataIsSuccess, execute: execute } = useDelete();
    const [confirmation, setConfirmation] = useState(false);
    const [blockedId, setBlockedId] = useState(0);

    function handleSubmit() {
        setConfirmation(false);
        execute(`block/${blockedId}`);
    }

    useEffect(() => {
        if (dataDelete && !isLoading) {
            setBlockedId(dataDelete?.data);
        }
    }, [dataDelete, dataLoading])
    //api

    const showCards = blockedUsers.length > 0 ? blockedUsers.map((user) => (
        <article key={user.id} className={Style.cardInnerContainer} onClick={() => { setBlockedId(user.id);  setConfirmation(true)}}>
            <img src={user.user_image || Hero} alt="" className={Style.cardImg} />
            <div className={Style.descContainer}>
                <h3 className={Style.cardUserName}>{user.user_name} </h3>
            </div>
        </article>
    )) : <p>No blocked users.</p>
    
    return(
        <>
            <p style={{marginBottom:"1em"}}>Clicked user to unblock.</p>
            <section className={Style.section}>
                {showCards}
            </section>

            <Modal
                handleSubmit={handleSubmit}
                confirmation={confirmation}
                confirmationMsg={"unblock this user"}
                successMsg={dataDelete?.message}
                loading={dataLoading}
                success={dataIsSuccess}
                setConfirmation={setConfirmation}
                goTo={`/users/${blockedId}`}
                buttonBackName="User"
            ></Modal>
        </>
        )

}

export default BlockedUsers