import Style from "./TransactionForm.module.css";
import { FiMessageCircle } from "react-icons/fi";
import { MdArrowBack } from "react-icons/md";
import Hero from "../../assets/signatureImg.png";
import { useState } from "react";
import { NavLink, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useGet, usePut } from "../../helpers/PetHelper";
import Modal from "../../components/others/Modal";
import PageLoading from "../../components/feedbackComponents/PageLoading";
import PageError from "../../components/feedbackComponents/PageError";

function TransactionForm() {
    
    const navigate = useNavigate();
    
    const id = useParams().id;
    const { data, error:transactionError, isLoading:transactionIsLoading } = useGet(`transaction/${id}`);
    const responded = data?.data?.user?.responded === null;
    
    //pet images
    function convertKey(key) {
        return key.replace(/([A-Z])/g, " $1")
                  .replace(/^./, char => char.toUpperCase());
    }

    const imgCount = [1, 2, 3, 4];
    const showPetImages = data?.data?.pet_images.map((image, index) => (
        <img className={Style.petImages} src={image} alt="" key={index}/>
    ));
    
    //pet basic info
    const petInfo = {
        species: data?.data?.pet_info.species,
        breed: data?.data?.pet_info.breed,
        gender: data?.data?.pet_info.gender,
        color: data?.data?.pet_info.color,
        age: data?.data?.pet_info.age
    };

    const showPetInfo = Object.entries(petInfo).map(([key, value]) => (
         <div className={Style.infoInnerContainer} key={key}>
            <p className={Style.key}>{convertKey(key)}</p>
            <p className={Style.value}>{value}</p>
        </div>
    ));
    
    //pet transaction info
    const transactionType = data?.data?.pet_transaction;
    let transactionDetails = {};

    switch (transactionType) {
        case 1:
            transactionDetails = {
                description: data?.data?.pet_other_info.description,
                medicalRecord: data?.data?.pet_other_info.medical_record,
                diagnosis: data?.data?.pet_other_info.diagnosis,
                vaccineRecord: data?.data?.pet_other_info.vaccine_records,
                currentMedicines: data?.data?.pet_other_info.current_medicines
            };
            break;

        case 2:
            transactionDetails = {
                description: data?.data?.pet_other_info.description,
                dateFound: data?.data?.pet_other_info.date_found,
                foundAt: data?.data?.pet_other_info.found_at
            };
            break;

        case 3:
            transactionDetails = {
                description: data?.data?.pet_other_info.description,
                dateLost: data?.data?.pet_other_info.date_lost,
                lostAt: data?.data?.pet_other_info.lost_at
            };
            break;

        default:
            transactionDetails = {};
    }
    
         const showTransactInfo = Object.entries(transactionDetails).map(([key, value]) => (
            <div className={Style.infoInnerContainer} key={key}>
                <p className={Style.key}>{convertKey(key)}</p>
                <p className={Style.value}>{value}</p>
            </div>
         ));
    
    const [showSetting, setShowSetting] = useState(false);

    const { data: dataPut, error, loading, isSuccess, execute } = usePut();
    const [confirmation, setConfirmation] = useState(false);
    const [action, setAction] = useState(null);

    function handleSubmit() {
        setConfirmation(false);
        execute(`transaction/${id}`, { "action" : action});
    }
    
    if (transactionIsLoading) {
        return <PageLoading></PageLoading>
    }

    if (!transactionIsLoading && transactionError) {
        return <PageError></PageError>
    }
    return (
        <main className={Style.mainTransactionForm}>
            <section className={Style.outerInfoContainer}>
                <MdArrowBack onClick={() => navigate(-1)}></MdArrowBack>
                <div className={Style.userImageContainer}>
                    <img src={ data?.data?.user?.user_image || Hero} alt="" className={Style.userImage} />
                    <h2 className={Style.userName}>{data?.data?.user?.user_name}</h2>
                    <p>Started at : {data?.data?.started_at}</p>
                </div>
                <FiMessageCircle onClick={() => { setShowSetting(prev => !prev); navigate(data?.data?.user?.user_name ? `/messages?name=${data?.data?.user?.user_name}` : "/messages")}}></FiMessageCircle>
            </section>
            <section className={Style.infoOuterContainer}>
                <div className={Style.imageContainer}>
                    {showPetImages}
                </div>
                <div  className={Style.petInfoContainer}>
                    {showPetInfo}
                </div>
                <div className={Style.transctionInfoContainer}>
                    {showTransactInfo}
                </div>
                <div>
                    <p style={{textAlign:"center"}}> For more information about form submitted by <NavLink to={`/users/${data?.data?.user?.user_id}`}>{data?.data?.user?.user_name}</NavLink> you can use message feature. <NavLink to={`/request_forms/${data?.data?.form_public_id}`}>Form Submitted</NavLink> </p>
                </div>
                <p style={{textAlign:"center", color:"red"}}>{error}</p>
                {responded &&  (<div className={Style.actionBtnContainer}>
                    <button className={Style.declineBtn} onClick={() => { setAction(0);  setConfirmation(true)}}>Mark as cancelled</button>
                    <button className={Style.doneBtn} onClick={() => { setAction(1);  setConfirmation(true)}}>Mark as Done</button>
                </div>)}
                {
                    !responded && (<p style={{ textAlign: "center", fontWeight:"bolder"}}>Please wait for other participant to response in this transaction.</p>)
                }
                <Modal
                    handleSubmit={handleSubmit}
                    confirmation={confirmation}
                    confirmationMsg={action ? "mark as done your transation" : "mark as cancelled your transation"}
                    successMsg={dataPut?.message}
                    loading={loading}
                    success={isSuccess}
                    setConfirmation={setConfirmation}
                    goTo={"/setting"}
                    buttonBackName="Back"
                ></Modal>
            </section>
        </main>
    )

}

export default TransactionForm;