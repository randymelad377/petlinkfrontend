import Style from "../petsPages/PetInfo.module.css";
import Hero from "../../assets/signatureImg.png";
import { useEffect, useState } from "react";
import { useGet, usePost, usePut } from "../../helpers/PetHelper";
import { useParams } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import { ImCross } from "react-icons/im";
import Modal from "../../components/others/Modal";
import PageErrorInside from "../../components/feedbackComponents/PageErrorInside";
import PageLoading from "../../components/feedbackComponents/PageLoading";

function PetUpdate() {

    const id = useParams().id;
    const { data, error, isLoading } = useGet(`pets/${id}`);

    const [petInfo, setPetInfo] = useState({});
    const [petOwner, setPetOwner] = useState({});
    const [petQuestion, setPetQuestion] = useState([]);
    const [petTransactionInfo, setPetTransactionInfo] = useState({});
    const [petImages, setPetImages] = useState([]);
    const [transactionType, setTransactionType] = useState(0);
    const [petStatus, setPetStatus] = useState("");
    const [newPetImages, setNewPetImages] = useState([]);
    const statusVerified = data?.data?.pet_info.statusVerified;

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

    //SHOW FUNCTION
    function convertKey(key) {
        return key
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    //PET IMAGES
    const showPetImages = petImages.map((image, index) => (
        <img className={Style.petImages} src={image} alt="" key={index}/>
    ));

    //PET INFO
    const showPetInfo = Object.entries(petInfo).filter(([key]) => key !== "species" && key !== "statusVerified").map(([key, value]) => (
         <div className={Style.infoInnerContainer} key={key}>
            <label className={Style.key}>{convertKey(key)}</label>
            <input className={Style.questionInput} onChange={(e) => setPetInfo(prev => ({...prev, [key] : e.target.value}))} value={value}/>
        </div>
    ));

    //PET OTHER INFO
    const showTransactInfo = Object.entries(petTransactionInfo).map(([key, value]) => (
        <div className={Style.infoInnerContainer} key={key}>
            <label className={Style.key}>{convertKey(key)}</label>
            <input className={Style.questionInput} onChange={(e) => setPetTransactionInfo(prev => ({...prev, [key] : e.target.value}))} value={value}/>
        </div>
    ));

    //PET QUESTION SHOW
    const showQuestion = petQuestion.map((question, index) => (
    <div className={Style.inputInnerContainer} key={question.question_id}>
        <label className={Style.questionLabel}>
            Question {index + 1}
        </label>

        <input
            type="text"
            className={Style.questionInput}
            value={question.question}
            onChange={(e) => {
                const value = e.target.value;

                setPetQuestion((prev) =>
                    prev.map((item) =>
                        item.question_id === question.question_id
                            ? { ...item, question: value }
                            : item
                    )
                );
            }}
        />
    </div>
));

    const [showWhatInfo, setShowWhatInfo] = useState("pets");
    const [showMenu, setShowMenu] = useState(false);

    const { data: updatePetData, loading: updatePetLoading, error: updatePetError, isSuccess: updatePetIsSuccess, execute: updatePetExecute } = usePut();
    const [confirmation, setConfirmation] = useState(false);

    function handleSubmit() {
        setConfirmation(false);

        let rawFormData = showWhatInfo === "pets" ? petInfo :
                            showWhatInfo === "transactions/update_other_pet_info" ? petTransactionInfo :
                            showWhatInfo === "transactions/update_questions" ? petQuestion : {};

        if (showWhatInfo === "transactions/update_other_pet_info") {
            rawFormData = { ...rawFormData, pet_public_id: id, transaction_type_id: transactionType };
        } else if (showWhatInfo === "transactions/update_questions") {
            rawFormData = {};

            petQuestion.forEach((question, index) => {
                Object.entries(question).forEach(([key, value]) => {
                    rawFormData[`questions[${index}][${key}]`] = value;
                });
            });
        } else if ("pets") {
            newPetImages.forEach((image, index) => {
                rawFormData[`images[${index}]`] = image;
            });
        }

        const apiRoute = showWhatInfo === "pets" ? `${showWhatInfo}/${id}` : `${showWhatInfo}`;
        updatePetExecute(apiRoute, rawFormData);
    }


    // RE DISPLAY PET

    function convertCamel(key) {
        return key
            .replace(/([A-Z])/g, "_$1")
            .toLowerCase();
    }
    
    const transactionDetailsMap = {
        1: {
            description: "description ni pet",
            medicalRecord: "medicalRecord ni pet",
            diagnosis: "diagnosis ni pet",
            vaccineRecord: "vaccineRecord ni pet",
            currentMedicines: "currentMedicines ni pet"
        },
        3: {
            description: "description  ni pet",
            dateLost: "2026-01-01",
            lostAt: "lost at ni  ni pet"
        }
    };

    const [showForm, setShowForm] = useState(false);
    const [newTransactionType, setNewTransactionType] = useState(1);
    const [transactionDetails, setTransactionDetails] = useState(transactionDetailsMap[transactionType] || {});

    useEffect(() => {
        setTransactionDetails(transactionDetailsMap[newTransactionType] || {});
    }, [newTransactionType]);

    const showPetTransctionInfoInput = Object.entries(transactionDetails).map(([key, value]) => (
        <input key={key} type="text" value={value} placeholder={convertKey(key)} onChange={(e) => setTransactionDetails(prev =>({ ...prev, [key]: e.target.value}))}/>
    ));
    
    const [newQuestions, setNewQuestions] = useState(["Question 1 ni pet", "Question 2 ni pet", "Question 3 ni pet"]);

    const showQuestionsInput = newQuestions.map((question, index) => (
        <input key={index} value={question} type="text" placeholder={question} onChange={e => {
            const prev = [...newQuestions];
            prev[index] = e.target.value;
            setNewQuestions(prev);
        }}/>
    ))

    const { data: postData, loading: postLoading, error: postError, isSuccess: postIsSuccess, execute } = usePost();

    function handleReDisplay() {
        setConfirmation(false);
        const formData = new FormData();

        // simple fields
        formData.append("transaction_type_id", newTransactionType);
        formData.append("pet_public_id", id);

        // transaction details
        Object.entries(transactionDetails).forEach(([k, v]) => {
            formData.append(convertCamel(k), v);
        });

        // questions (IMPORTANT)
        newQuestions.forEach((q, i) => {
            formData.append(`questions[${i}]`, q);
        });

        execute("transactions/redisplay-pet", formData);
    }

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const { data: deleteData, loading: deleteLoading, error: deleteError, isSuccess: deleteIsSuccess, execute: deleteExecute } = usePut();
    function handleDelete() {
        const formData = new FormData();
        setDeleteConfirmation(false);
        deleteExecute(`user/softDelete/${id}`, formData);
    }

    const [unDisplayConfirmation, setUnDisplayConfirmation] = useState(false);
    const { data: unDisplayData, loading: unDisplayLoading, error: unDisplayError, isSuccess: unDisplayIsSuccess, execute: unDisplayExecute } = usePut();
    function handleUnDisplay() {
        setUnDisplayConfirmation(false);
        unDisplayExecute(`user/un-display/${id}`, {})
    }

    if (isLoading) return <PageLoading></PageLoading>
    if (error) return <PageErrorInside error = {error} />
    return (
        <main className={Style.mainPetInfo}>

            <section className={Style.infoOuterContainer}>
                <div className={Style.menuOuterContainer}>
                    <MdMenu className={Style.menuIcon} onClick={() => setShowMenu(prev => !prev)}/>
                    { showMenu &&(<ol className={Style.settingContainer}>
                                        <li onClick={() => { setShowMenu(prev => !prev); setShowWhatInfo("pets") }}>Pet Information</li>
                                        {statusVerified && (<li onClick={() => { setShowMenu(prev => !prev); setShowForm(true) }}>Dispay pet as available</li>)}
                                        {!statusVerified &&  (<>
                                            <li onClick={() => {setShowMenu(prev => !prev); setShowWhatInfo("transactions/update_other_pet_info")}}>Other Pet Information</li>
                                            <li onClick={() => {setShowMenu(prev => !prev); setShowWhatInfo("transactions/update_questions")}}>Questions to interested</li>
                                            <li onClick={() => {setShowMenu(prev => !prev); setUnDisplayConfirmation(true)}}>Un display</li>
                                            <li onClick={() => {setShowMenu(prev => !prev); setDeleteConfirmation(prev => !prev)}}>Delete</li>
                                            
                                        </>)}
                                    </ol>)
                    }
                </div>
                <div className={Style.imageContainer}>
                    {showPetImages}
                </div>
                {showWhatInfo === "pets" && (<div  className={Style.petInfoContainer}>
                    {showPetInfo}
                    <div className={Style.infoInnerContainer}>
                        <label className={Style.key}>Pet Images</label>
                          <input
                            className={Style.questionInput}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setNewPetImages(Array.from(e.target.files))}
                        />
                    </div>
                </div>)}
                {showWhatInfo === "transactions/update_other_pet_info" && (<div className={Style.transctionInfoContainer}>
                    {showTransactInfo}
                </div>)}
                {showWhatInfo === "transactions/update_questions" && (<div className={Style.transctionInfoContainer}>
                    {showQuestion}
                </div>)}

                {showForm && (<form className={Style.addPetFormContainer}>
                    <div className={Style.formInnerContainer}>
                        <div className={Style.iconContainer}>
                            <ImCross onClick={() => setShowForm(false)}/>
                        </div>
                        <p className={Style.desc}>Fill up the form below to proceed.</p>
                        <hr />
                        <div className={Style.checkBoxOuterContainer}>
                            <div className={Style.checkBoxContainer}>
                                <input type="radio" defaultChecked name="transactionType" onChange={() => setNewTransactionType(1)}/><label>Rehome</label>
                            </div>
                            <div className={Style.checkBoxContainer}>
                                <input type="radio" name="transactionType" onChange={() => setNewTransactionType(3)} /><label>Missing</label>
                            </div>
                        </div>
                        {showPetTransctionInfoInput}
                        <hr />
                        <p className={Style.desc}>Atleast provide three question for interested</p>
                        {showQuestionsInput}
                        {
                            postError && <p style={{textAlign:"center", color:"red"}}>{postError}</p>
                        }
                        <button type="button" onClick={() => setConfirmation(true)} className={Style.submitBtn}>Submit</button>
                    </div>
                </form>)}

                <p style={{textAlign:"center", color:"red"}}>{updatePetError}</p>
                <p style={{textAlign:"center", color:"red"}}>{unDisplayError}</p>
                <p style={{textAlign:"center", color:"red"}}>{deleteError}</p>
                <div className={Style.actionContainer}>
                    <button className={Style.submitButton} onClick={() => {setConfirmation(true)}}>{"Update"}</button>
                </div>
            </section>

            <Modal
                handleSubmit={showForm ? handleReDisplay : handleSubmit}
                confirmation={confirmation}
                confirmationMsg={"submit"}
                successMsg={showForm ? postData?.message : updatePetData?.message}
                loading={showForm ? postLoading : updatePetLoading}
                success={showForm ? postIsSuccess : updatePetIsSuccess}
                setConfirmation={setConfirmation}
                goTo={"/setting"}
                buttonBackName={"Back"}
            ></Modal>

            <Modal
                handleSubmit={handleDelete}
                confirmation={deleteConfirmation}
                confirmationMsg={"delete"}
                successMsg={deleteData?.message}
                loading={deleteLoading}
                success={deleteIsSuccess}
                setConfirmation={setDeleteConfirmation}
                goTo={"/"}
            ></Modal>

            <Modal
                handleSubmit={handleUnDisplay}
                confirmation={unDisplayConfirmation}
                confirmationMsg={"un display, other information will be deleted as well as form request"}
                successMsg={unDisplayData?.message}
                loading={unDisplayLoading}
                success={unDisplayIsSuccess}
                setConfirmation={setUnDisplayConfirmation}
                goTo={"/"}
            ></Modal>
        </main>
    )

}

export default PetUpdate