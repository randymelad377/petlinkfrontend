import Style from "./ModalFeedback.module.css";
import Hero from "../../../assets/signatureImg.png";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDelete, usePut } from "../../../helpers/PetHelper";
import Modal from "../../others/Modal";
import { useNavigate } from "react-router-dom";

function ModalFeedback({setShowFeedback, data, setConcerns}) {

    const navigate = useNavigate();
    const [read, setRead] = useState(data?.isRead); 
    const [concernId, setConcernId] = useState(0);

    useEffect(() => {
        setConcernId(data?.id);
    }, [data])

    const { data:dataUpdate, loading, error, isSuccess, execute } = usePut();
    function handleSubmit() {
        const formData = new FormData();
        execute(`concerns/${data.id}`, formData);
    }

    useEffect(() => {
        if(isSuccess && !loading){
            setConcerns(dataUpdate?.data || [])
        }
    }, [dataUpdate, loading]);

    const { data:dataDelete, loading:dataLoading, error:dataError, isSuccess:dataIsSuccess, execute:dataExecute } = useDelete();
    const [confirmation, setConfirmation] = useState(false);
    function handleDelete() {
        setConfirmation(false);
        dataExecute(`concerns/${concernId}`);
        if(!dataLoading){
            setShowFeedback(false);
        }
    }
    
    useEffect(() => {
        if(dataIsSuccess && !dataLoading){
            setConcerns(dataDelete?.data || []);
        }
    }, [dataDelete, dataLoading]);
    
    return (
        <section className={Style.modalFeedbackOuterContainer}>
            <article className={Style.modalFeedbackInnerContainer}>
                <div className={Style.userContainer}>
                    <img src={data?.user_image || Hero} alt="" />
                    <h2 onClick={() => navigate(`/admin/users/${data?.user_id}`)}>{data?.user_name}</h2>
                    <IoClose className={Style.closeIcon} onClick={() => setShowFeedback(false)}></IoClose>
                </div>
                <div className={Style.feedback}>
                    {data?.image && <img src={data?.image || Hero} className={Style.feedbackImg} alt="" />}
                    <p className={Style.feedbackDesc}>{data?.message || "No message provided."}</p>
                </div>
                <div className={Style.actionContainer}>
                   <button onClick={() => setConfirmation(true)} className={Style.markBtn}>Delete</button>
                    {!read && (<button onClick={() => { setRead(true); handleSubmit()}} className={Style.markBtn}>Mark as read</button>)}
                    {read && (<button onClick={() => { setRead(false);  handleSubmit()}} className={Style.markBtn}>Mark as unread</button>)}
                </div>
            </article>
              <Modal
                handleSubmit={handleDelete}
                confirmation={confirmation}
                confirmationMsg={"delete"}
                successMsg={dataDelete?.message}
                loading={dataLoading}
                success={false}
                setConfirmation={setConfirmation}
                goTo={"/"}
            ></Modal>
        </section>
    )
}

export default ModalFeedback