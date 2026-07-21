import Style from "../petComponents/PetHistory.module.css";
import Hero from "../../assets/signatureImg.png";
import { IoMdClose } from "react-icons/io";
import { useGet } from "../../helpers/PetHelper";
import { useNavigate } from "react-router-dom";

function UserTransactions({setShowTransaction, id}) {
    
    const navigate = useNavigate();

    const { data, isLoading, error } = useGet(`admin/user/get-user-transactions/${id}`);
    const showTransactions = data?.data.map((transaction, index) => (
        <li key={index} className={Style.historyCard}><h4>{index + 1}</h4> <div><img src={transaction.user_image || Hero}/> {transaction.message} <img onClick={() => navigate("/admin/users/" + transaction.other_user_id)} src={transaction.other_user_image || Hero} /></div><p className={Style.hide}></p></li>
    ));


    return (
        <section className={Style.historyOC}>
            <ol className={Style.historyIC}>
                <li className={Style.historyCard}><IoMdClose onClick={() => setShowTransaction(false)} /></li>
                {isLoading && <p style={{textAlign:"center",margin:"30px"}}>Loading...</p>}
                {data?.data?.length === 0 && !isLoading ? <p style={{textAlign:"center",margin:"30px"}}>No Transation found.</p> : showTransactions}
            </ol>
        </section>    
    )
    
}

export default UserTransactions