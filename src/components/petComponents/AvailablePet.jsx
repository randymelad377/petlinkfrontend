import Style from "./AvailablePet.module.css";
import Hero from "../../assets/signatureImg.png";
import { useNavigate } from "react-router-dom";
import PetLoading from "./PetLoading";

function AvailablePet({ pets = [], loading, goto = ""}) {
    
    const navigate = useNavigate();

     if (loading) {
        return <PetLoading></PetLoading>
    }

    const displayPet = pets?.map((pet, index) => {
        return (
            <article className={Style.card} key={index}>
                <img className={Style.image} src={pet.pet_image} alt="" />
                <h3 className={Style.species}>
                    {pet.pet_species} <span className={Style.badge}>{pet.pet_transaction_type}</span>
                </h3>
                {pet.pet_transaction_type != "REHOME" && (<p className={Style.text}>Location {pet.pet_transaction_type === "FOUND" ? "found" : "lost"} : {pet.location}</p>)}
                <p className={Style.text}>Reported on : {pet.pet_created_at}</p>
                <button className={Style.button} onClick={() => navigate(goto ? `${goto}/${pet.public_id}` : `${pet.public_id}`)}>View Details</button>
            </article>  
        );
    });

    if(!pets || pets?.length == 0) return <h2 style={{width:"100%",textAlign:'center'}}>No pets available.</h2>

    return (
            <section className={Style.sectionPetCard}>
                {displayPet}
            </section>
    )
    
}

export default AvailablePet