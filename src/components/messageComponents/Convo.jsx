import Style from "./Convo.module.css";
import SearchBar from "../../components/others/SearchBar";
import Hero from "../../assets/signatureImg.png";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";

function Convo({ setShowWhat,
    setMessageNewUser,
    conversations = [],
    setConversationId,
    setSearchUserId,
    setSearchName,
    setOpenAi }) {
    console.log(conversations)
    const showConversations = conversations?.filter((convo) => convo.messages_count !== 0).map((convo, index) => (
        <article key={index} className={Style.innerContainer} onClick={() => { setShowWhat("msgs"); setConversationId(convo.public_id);  setSearchUserId(convo.receiver_id)}}>
            <img className={Style.messageImage} src={convo.user_image || Hero} alt="" />
            <h2 className={Style.messageName}>{convo.user_name}</h2>
        </article>
    ));

    return (
        <section className={Style.outerContainer}>
            <SearchBar setSearch={setSearchName}></SearchBar>
            <div className={Style.availableConvo}>
                {conversations.length === 0 ? <p style={{textAlign:"center"}}>{"No conversations available, use the add button below to search and message users"}.</p> : showConversations}
            </div>
            <p style={{textAlign:"center", fontSize:".8em"}}>Remove search input to view all available conversation.</p>
            <button className={Style.addBtnAi} onClick={() => { setShowWhat("aimsgs"); setOpenAi(prev => !prev)}}>Pet care ai</button>
            <button className={Style.addBtn} onClick={() => setMessageNewUser(true)}><IoMdAdd className={Style.addIcon} /></button>
        </section>
    )

}

export default Convo