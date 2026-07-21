import Style from "../petComponents/PetHistory.module.css";
import Hero from "../../assets/signatureImg.png";
import { IoMdClose } from "react-icons/io";
import { useGet } from "../../helpers/PetHelper";
import { useNavigate } from "react-router-dom";

function UserHistories({setShowHistories, id}) {
    
    const navigate = useNavigate();

    const { data, isLoading, error } = useGet(`admin/user/get-user-histories/${id}`);
    const showHistories = data?.data.map((history, index) => (
        <li key={index} className={Style.historyCard}><h4>{index + 1}</h4> <div><img src={history.user_image || Hero}/> {history.message} <img onClick={() => navigate("/admin/users/" + history.other_user_id)} src={history.other_user_image || Hero} /></div><p className={Style.hide}></p></li>
    ));


    return (
        <section className={Style.historyOC}>
            <ol className={Style.historyIC}>
                <li className={Style.historyCard}><IoMdClose onClick={() => setShowHistories(false)} /></li>
                {isLoading && <p style={{textAlign:"center",margin:"30px"}}>Loading...</p>}
                {data?.data?.length === 0 && !isLoading ? <p style={{textAlign:"center",margin:"30px"}}>No Transation found.</p> : showHistories}
            </ol>
        </section>    
    )
    
}

export default UserHistories