import Style from "./History.module.css";
import Hero from "../../assets/signatureImg.png";
import { MdMenu } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGet } from "../../helpers/PetHelper";

function Transaction() {
    

    const { data, isLoading, error } = useGet("transaction");
    
    const navigate = useNavigate();

    const showCards = data?.data.map((transaction, index) => (
        <article className={Style.cardInnerContainer} key={index} onClick={() => navigate(`/transaction/${transaction.public_id}`)}>
            <img src={transaction.user_image} alt="" className={Style.cardImg} />
            <div className={Style.descContainer}>
                <h3 className={Style.cardUserName}>{transaction.user_name} :</h3>
                <p className={Style.cardPetName}>Pet Involved ({transaction.pet_species})</p>
            </div>
        </article>
    ));

    return (
        <>
            <section className={Style.section}>
                {showCards}
            </section>
        </>
    )

}

export default Transaction