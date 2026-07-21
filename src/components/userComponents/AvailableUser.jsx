import Style from "./AvailableUser.module.css";
import Hero from "../../assets/signatureImg.png";
import { useNavigate } from "react-router-dom";

function AvailableUser({users = [], path = ""}) {

    const navigate = useNavigate();

    const showUsers = users.length > 0 ? users.map((user) => (
        <article className={Style.card} key={user.public_id}>
            <img className={Style.image} src={user.image} alt="User" />
            <div className={Style.content}>
                <h3 className={Style.userName}> {user.name} </h3>
                <p className={Style.role}> Community Member </p>
                <button onClick={() => navigate(`${path}${user.public_id}`)} className={Style.button}> View Profile </button>
            </div>
        </article>
    )) : <p>No user found.</p>

    return (
        <section className={Style.availableUserContainer}>
            {showUsers ? showUsers : "No users found."}
        </section>
    );
}

export default AvailableUser;