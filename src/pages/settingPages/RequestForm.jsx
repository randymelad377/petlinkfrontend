import Style from "./RequestForm.module.css";
import { FiMessageCircle } from "react-icons/fi";
import { MdArrowBack } from "react-icons/md";
import Hero from "../../assets/signatureImg.png";
import { NavLink, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useGet, useGetMsg, usePut } from "../../helpers/PetHelper";
import { act, useState } from "react";
import Modal from "../../components/others/Modal";
import PageError from "../../components/feedbackComponents/PageError";
function RequestForm() {
    
    const id = useParams().id;
    const { data, error, isLoading } = useGetMsg(`forms/${id}`);
    
    const form = data?.data;

    const navigate = useNavigate();
    const showQuestionsAnwers = form?.answers.map((questionAnswer, index) => (
        <div className={Style.innerInputContainer} key={index}>
            <p className={Style.question}>{questionAnswer["question"]}</p>
            <p className={Style.answer}>{questionAnswer["answer"]}</p>
        </div>
    ))

    const { data: dataPut, loading: loadingPut, error: errorPut, isSuccess: isSuccessPut, execute } = usePut();
    const [confirmation, setConfirmation] = useState(false);
    const [action, setAction] = useState(false);

    function handleSubmit() {
        setConfirmation(false)
        execute(`forms/${id}`, {"action" : action});
    }

    return (
        <main className={Style.mainRequestForm}>
            <section className={Style.outerInfoContainer}>
                <MdArrowBack onClick={() => navigate(-1)}></MdArrowBack>
                <div className={Style.imageContainer}>
                    <img src={form?.user?.user_image || Hero} alt="" className={Style.userImage} />
                    <h2 className={Style.userName}>{form?.user?.user_name}</h2>
                </div>
                <FiMessageCircle onClick={() => navigate(form?.user?.user_name ? `/messages?name=${form?.user?.user_name}` : "/messages")}></FiMessageCircle>
            </section>
            <hr />
            <section className={Style.outerInputContainer}>
                {showQuestionsAnwers}
            </section>
            <section>
                <p className={Style.description}> For more information about form submitted by {form?.user?.user_name} can use message feature. <NavLink to={form?.isOwner ? `/pets/update/${form?.pet_id}` : `/pets/${form?.pet_id}`}>For pet involved click here</NavLink> </p>
                {form?.hasTransaction && (<section className={Style.verifyBtnContainer}>
                    {form?.myRequest && (<button onClick={() => { setAction(0);  setConfirmation(true)}}>Cancel</button>)}
                    {!form?.myRequest && (<><button onClick={() => { setAction(0);  setConfirmation(true)}}>Decline</button>
                                         <button onClick={() => { setAction(1);  setConfirmation(true)}}>Accept</button></>)}
                </section>)}
                <Modal
                    handleSubmit={handleSubmit}
                    confirmation={confirmation}
                    confirmationMsg={action ? "accept" : "cancel"}
                    successMsg={dataPut?.message}
                    loading={loadingPut}
                    success={isSuccessPut}
                    setConfirmation={setConfirmation}
                    goTo={"/setting/transactions"}
                    buttonBackName={"Transactions"}
                ></Modal>
            </section>
        </main>
    )

}

export default RequestForm