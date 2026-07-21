import Style from "./History.module.css";
import { MdDelete } from "react-icons/md";
import Hero from "../../assets/signatureImg.png";
import { useNavigate } from "react-router-dom";
import { useGet } from "../../helpers/PetHelper";
import { useEffect } from "react";

function History() {
    
    const { data, error, isLoading } = useGet("history");
    const navigate = useNavigate();

    const showCards = data?.data?.map((history) => (
        <article className={Style.cardInnerContainer} onClick={() => navigate(`/history/${history.public_id}`)}>
            <img src={history.user_image} alt="" className={Style.cardImg} />
            <div className={Style.descContainer}>
                <h3 className={Style.cardUserName}>{history.user} :</h3>
                <p className={Style.cardPetName}>Pet Involved ({history.species})</p>
            </div>
            <MdDelete className={Style.cardDeleteIcon}></MdDelete>
        </article>
    ));

    return(
        <section className={Style.section}>
            {showCards}
        </section>
    )

}

export default History