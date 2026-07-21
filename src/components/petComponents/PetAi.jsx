import { useState } from "react";
import Style from "./PetAi.module.css";
import { IoMdSend } from "react-icons/io";

function PetAi({ messages = {}, setMessages, count, setCount}) {

    const [message, setMessage] = useState("");


    const showMessages = Object.entries(messages).map((msg) => {
        const className = msg[1] === "user" ? Style.right : Style.left;
        return <li className={className}>{msg[0]}</li>
    })

    return (
        <section className={Style.AiOC}>
            <h3>Petlink AI assistant for pet caring.</h3>
            <ol className={Style.AiMsgOC}>
                {showMessages}
            </ol>
            <div className={Style.sendContainer}>
                <input type="text" onChange={(e) => setMessage([e.target.value, "user", count + 1])}/>
                <button><IoMdSend></IoMdSend></button>
            </div>
        </section>
    )
}

export default PetAi;