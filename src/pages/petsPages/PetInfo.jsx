import Style from "./PetInfo.module.css";
import Hero from "../../assets/signatureImg.png";
import { ImCross } from "react-icons/im";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import { useGet, usePost } from "../../helpers/PetHelper";
import Modal from "../../components/others/Modal";
import PageErrorInside from "../../components/feedbackComponents/PageErrorInside";

function PetInfo() {

    const navigate = useNavigate();
    //function to convert key name into readable
    function convertKey(key) {
        return key.replace(/([A-Z])/g, " $1")
                  .replace(/^./, char => char.toUpperCase());
    }

    const param = useParams();

    const petId = param.id;
    const { data, isLoading, error } = useGet(`pets/${petId}`); 

    const [petInfo, setPetInfo] = useState({});
    const [petOwner, setPetOwner] = useState({});
    const [petQuestion, setPetQuestion] = useState([]);
    const [petTransactionInfo, setPetTransactionInfo] = useState({});
    const [petImages, setPetImages] = useState([]);
    const [transactionType, setTransactionType] = useState(0);
    const [petStatus, setPetStatus] = useState("");

    const [answers, setAnswers] = useState([]);
    
    const buttonName =
        transactionType === 1 ? "Adopt" :
        transactionType === 2 ? "Retrieve" :
        transactionType === 3 ? "Return" :
        "";

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
    const showPetImages = petImages.map((image,index) => (
        <img className={Style.petImages} src={image} alt="" key={index}/>
    ));
    
    //PET INFO SHOW
    const showPetInfo = Object.entries(petInfo).map(([key, value]) => (
         <div className={Style.infoInnerContainer} key={key}>
            <p className={Style.key}>{convertKey(key)}</p>
            <p className={Style.value}>{value}</p>
        </div>
    ));
    
    //TRANSACTION INFO SHOW
    const showTransactInfo = Object.entries(petTransactionInfo).map(([key, value]) => (
        <div className={Style.infoInnerContainer} key={key}>
            <p className={Style.key}>{convertKey(key)}</p>
            <p className={Style.value}>{value}</p>
        </div>
    ));

    //PET QUESTION SHOW
    const showQuestion = petQuestion.map((question, index) => (
    <div className={Style.inputInnerContainer} key={question.question_id}>
        <label className={Style.questionLabel}>{question.question}</label>
        <input type="text" className={Style.questionInput}  onChange={(e) => {
            const value = e.target.value;
            setAnswers((prev) => {
            const existing = prev.find(
                (item) => item.question_id === question.question_id
                );
                
            if (existing) {
                return prev.map((item) =>
                item.question_id === question.question_id
                    ? { ...item, answer: value }
                    : item
                );
            }
            return [
                ...prev,
                {
                question_id: question.question_id,
                answer: value,
                },
            ];
            });
        }}
        />
    </div>
    ));

    const [showMenu, setShowMenu] = useState(false);
    const [show, setShow] = useState("petInfo");
    function toggleShow(show) {
        setShowMenu(prev => !prev);
        setShow(show);
    }
    
    const [showForm, setShowForm] = useState(false);
    const { data:dataStore, loading:isLoadingStore, error:errorStore, isSuccess:isSuccessStore, execute } = usePost();
    const [confirmation, setConfirmation] = useState(false);
    function handleSubmit() {
        setShowForm(false);
        setConfirmation(false);
        const formData = new FormData();
        formData.append("pet_public_id", petId);
        answers.forEach((answer, index) => {
            formData.append(`answers[${index}][question_id]`, answer.question_id);
            formData.append(`answers[${index}][answer]`, answer.answer);
        });
        execute("forms", formData);
    }

    return (
        <main className={Style.mainPetInfo}>
            <section className={Style.infoOuterContainer}>
                <div className={Style.userInfo}>
                    <img src={petOwner?.user_image ?? Hero} alt="" className={Style.userImage} />
                    <div className={Style.userInfoInnerContainer}>
                        <h2 className={Style.userName} onClick={() => navigate(`/users/${petOwner?.public_id}`)}>{petOwner?.user_name ?? "Petlink"}</h2>
                            <FiMessageCircle className={Style.messageIcon} onClick={() =>navigate(petOwner?.user_name ? `/messages?name=${petOwner?.user_name}` : `/messages`)}/>
                    </div>
                </div>
                <div className={Style.imageContainer}>
                    {showPetImages}
                </div>
                <div  className={Style.petInfoContainer}>
                    {showPetInfo}
                </div>
                <div className={Style.transctionInfoContainer}>
                    {showTransactInfo}
                </div>
                {errorStore && <p style={{ textAlign: "center", color: "red" }}>{errorStore}</p>}
                <div className={Style.actionContainer}>
                    <button className={Style.submitButton} onClick={() => setShowForm(true)}>{buttonName}</button>
                </div>
            </section>

            {
                (showForm && !confirmation) && (
                    <form className={Style.questionContainer} >
                        <div className={Style.questionInnerContainer}>
                            <div className={Style.iconContainer}>
                                <ImCross className={Style.closeIcon} onClick={() => setShowForm(false)}></ImCross>
                            </div>
                            <p className={Style.questionDesc}>Please fill up the form below to send request.</p>
                            {showQuestion}
                            <button type="button" onClick={() => setConfirmation(true)} className={Style.submitButton}>Submit</button>
                        </div>
                    </form>
                )
            }

            <Modal
                handleSubmit={handleSubmit}
                confirmation={confirmation}
                confirmationMsg={"submit"}
                successMsg={data?.message}
                loading={isLoadingStore}
                success={isSuccessStore}
                setConfirmation={setConfirmation}
                goTo={"/setting"}
                buttonBackName={"Back"}
            ></Modal>
        </main>
    )
}

export default PetInfo