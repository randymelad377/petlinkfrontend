import Style from "./AdminBanSuspend.module.css";
import Hero from "../../assets/signatureImg.png";
import { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGet, usePut } from "../../helpers/PetHelper";
import Modal from "../../components/others/Modal";

function AdminBanSuspend() {
    
    const [restrictionType, setRestrictionType] = useState("suspended");
    const { data, error, loading } = useGet(`admin/user/get-restriction-users?restriction_type=${restrictionType}`);

    const users = data?.data || [];
    
    //Account action api
    const [userId, setUserId] = useState("");
    const [action, setAction] = useState("re-activate");
    const [confirmation, setConfirmation] = useState(false);
    const { data:updateData, loading:updateLoading, error:updateError, isSuccess:updateIsSuccess, execute:updateExecute } = usePut();
    function handleSubmit() {
        setConfirmation(false);
        
        updateExecute(`user/account-action`, {"user_id": userId, "action" : action});
    }
    //Account action api

    const showCards = users.length > 0 ? users.map((user) => {
        return (<article key={user.public_id} className={Style.cardInnerContainer} onClick={() => { setUserId(user.public_id); setConfirmation(true)}}>
            <img src={user.image || Hero} alt="" className={Style.cardImg} />
            <div className={Style.descContainer}>
                <h3 className={Style.cardUserName}>{user.name} </h3>
            </div>
        </article>)
    }) : <p>No user found.</p>;

    const [showMenu, setShowMenu] = useState(false);
    
    return(
        <>
            <section className={Style.restrictionOuterContainer}>
                <article className={Style.settingHeader}>
                    <div>
                        <h2>Restrictions</h2>
                        <p>Manage suspended and banned users</p>
                    </div>
                    <div className={Style.menuOuterContainer}>
                        <MdMenu onClick={() => setShowMenu(prev => !prev)}/>
                        { showMenu &&(<ol className={Style.settingContainer}>
                                            <li onClick={() => {setShowMenu(prev => !prev); setRestrictionType("suspended")}}>Suspended</li>
                                            <li onClick={() => {setShowMenu(prev => !prev); setRestrictionType("banned")}}>Banned</li>
                                        </ol>)
                        }
                    </div>
                </article>
                <article className={Style.userCardContainer}>
                    {showCards}
                </article>
            </section>
            <Modal
                handleSubmit={handleSubmit}
                confirmation={confirmation}
                confirmationMsg={action}
                successMsg={updateData?.message}
                loading={updateLoading}
                success={updateIsSuccess}
                setConfirmation={setConfirmation}
                goTo={`/admin/users/${userId}`}
            ></Modal>
        </>
        )

}

export default AdminBanSuspend