import Style from "./PetHistory.module.css";
import Hero from "../../assets/signatureImg.png";
import { IoMdClose } from "react-icons/io";
import { useGet } from "../../helpers/PetHelper";

function PetHistory({setOpenHistory, pet_id}) {
    
    const { data, isLoading, error } = useGet(`admin/pets/get-histories/${pet_id}`);

    const showHistories = data?.data.map((history, index) => (
        <li key={index} className={Style.historyCard}><h4>{index + 1}</h4> <div><img src={history.pet_poster_image || Hero}/> {history.message} <img src={history.pet_interested_image || Hero} /></div><p className={Style.hide}></p></li>
    ));


    return (
        <section className={Style.historyOC}>
            <ol className={Style.historyIC}>
                <li className={Style.historyCard}><IoMdClose onClick={() => setOpenHistory(false)}/></li>
                {data?.data?.length === 0 ? <p style={{textAlign:"center",margin:"30px"}}>No history found.</p> : showHistories}
            </ol>
        </section>    
    )
    
}

export default PetHistory