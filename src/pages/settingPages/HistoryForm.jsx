import Style from "./TransactionForm.module.css";
import { MdMenu } from "react-icons/md";
import { MdArrowBack } from "react-icons/md";
import Hero from "../../assets/signatureImg.png";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGet } from "../../helpers/PetHelper";

function HistoryForm() {
    
    const navigate = useNavigate();
    const id = useParams().id;

    const { data, error, isLoading } = useGet(`history/${id}`);

    function convertKey(key) {
        return key.replace(/([A-Z])/g, " $1")
                  .replace(/^./, char => char.toUpperCase());
    }

    function convertKeyS(key) {
        return key
            .replace(/_/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
    }
    //pet images

    const showPetImages = data?.data?.pet_info?.pet_images.map((image, index) => (
        <img className={Style.petImages} src={image || Hero} alt="" key={index} />
    ));
    
    //pet basic info
    const petInfo = {
        species: data?.data?.pet_info?.pet_info?.species,
        breed: data?.data?.pet_info?.pet_info?.breed,
        gender: data?.data?.pet_info?.pet_info?.gender,
        color: data?.data?.pet_info?.pet_info?.color,
        age: data?.data?.pet_info?.pet_info?.age
    };

    const showPetInfo = Object.entries(petInfo).map(([key, value]) => (
         <div className={Style.infoInnerContainer} key={key}>
            <p className={Style.key}>{convertKey(key)}</p>
            <p className={Style.value}>{value}</p>
        </div>
    ));

    const showTransactInfo = Object.entries(data?.data?.other_pet_info || {}).map(([key, value]) => (
       <div className={Style.infoInnerContainer} key={key}>
           <p className={Style.key}>{convertKeyS(key)}</p>
           <p className={Style.value}>{value}</p>
       </div>
    ));
    
    const [showSetting, setShowSetting] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const showQuestionsAnwers = data?.data?.questions.map((question) => (
            <div className={Style.innerInputContainer} key={question["question_id"]}>
                <p className={Style.question}>{question["question"]}</p>
                <p className={Style.answer}>{question["answer"]}</p>
            </div>
        ))
    return (
        <main className={Style.mainTransactionForm}>
            <section className={Style.outerInfoContainer}>
                <MdArrowBack onClick={() => navigate(-1)}></MdArrowBack>
                <div className={Style.userImageContainer}>
                    <img src={data?.data?.image || Hero} alt="" className={Style.userImage} />
                    <h2 className={Style.userName}>{data?.data?.user}</h2>
                </div>
                <MdMenu onClick={() => setShowSetting(prev => !prev)}></MdMenu>
                { showSetting &&(<ol className={Style.settingContainer}>
                                    <li onClick={() => {setShowSetting(prev => !prev); setShowForm(false)}}>Pet Information</li>
                                    <li onClick={() => {setShowSetting(prev => !prev); setShowForm(true)}}>Form Submitted</li>
                                    <li onClick={() => {setShowSetting(prev => !prev); navigate(data?.data?.user ? `/messages?name=${data?.data?.user}` : "/messages")}}>Message User</li>
                                </ol>)
                }
            </section>
            { !showForm && (<section className={Style.infoOuterContainer}>
                <p style={{ textAlign: "center" }}>{data?.data?.label} on {data?.data?.created_at}</p>
                
                <div className={Style.imageContainer}>
                    {showPetImages}
                </div>
                <div  className={Style.petInfoContainer}>
                    {showPetInfo}
                </div>
                <div className={Style.transctionInfoContainer}>
                    {showTransactInfo}
                </div>
            </section>)}
            {showForm && (<section className={Style.outerInputContainer}>
                <h3 style={{textAlign:"center"}}>Form Submitted.</h3>
                {showQuestionsAnwers}
            </section>)}
        </main>
    )

}

export default HistoryForm;