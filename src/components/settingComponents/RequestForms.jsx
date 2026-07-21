import Style from "./History.module.css";
import Hero from "../../assets/signatureImg.png";
import { MdMenu } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGet } from "../../helpers/PetHelper";
function RequestForms() {
    
    const [showSetting, setShowSetting] = useState(false);
    const navigate = useNavigate();
    const [myRequest, setMyRequest] = useState("request-to-my-pet");
    const [label, setLabel] = useState(myRequest ? "Your Request" : "Request to your pets");

    useEffect(() => {
        setLabel(myRequest === "my-request" ? "Your Request" : "Request to your pets");
    }, [myRequest])

    const { data, isLoading, error } = useGet(`forms?requestTo=${myRequest}`);
    
    const showCards = data?.data?.forms.map((form, index) => (
        <article onClick={() => navigate(`/request_forms/${form.public_id}`)} className={Style.cardInnerContainer} key={index}>
            <img src={form.user.user_image || Hero} alt="" className={Style.cardImg} />
            <div className={Style.descContainer}>
                <h3 className={Style.cardUserName}>{form.user.user_name} :</h3>
                <p className={Style.cardPetName}>Pet Involved ({form.pet_species})</p>
            </div>
        </article>
    ));
    
    return(
        <>
            <section className={Style.menuContainer}>
                            <p>{label}</p>
                            <MdMenu onClick={() => setShowSetting(prev => !prev)} className={Style.menuIcon}></MdMenu>
                            { showSetting && (<ol>
                                <li onClick={() => {setMyRequest("my-request"); setShowSetting(false)}}>Your request</li>
                                <li onClick={() => { setMyRequest("request-to-my-pet");  setShowSetting(false)}}>Request to your pet</li>
                            </ol>)}
                        </section>
            <section className={Style.section}>
                {data?.data?.forms?.length !== 0 ? showCards : <h2 style={{textAlign:"center"}}>No Request Forms</h2>}
            </section>
        </>
        )

}

export default RequestForms