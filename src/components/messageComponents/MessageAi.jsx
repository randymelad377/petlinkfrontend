import Style from "./Message.module.css";
import { IoIosSettings } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import Hero from "../../assets/signatureImg.png";
import Modal from "../others/Modal";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDelete, useGetMsg, usePost, usePut } from "../../helpers/PetHelper";
import { UserInfoContext } from "../../context/UserContext";

function Message({width, setShowWhat, setOpenAi}) {
    const userContext = useContext(UserInfoContext);
    
    const messageRef = useRef(null);

    function scrollToBottom() {
        messageRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }

    const { data:dataMessages, error:errorMessages, isLoading:isLoadingMessages } = useGetMsg("chat-bot");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (dataMessages && !isLoadingMessages) {
            setMessages(dataMessages?.data || {});
        }
    }, [dataMessages, isLoadingMessages])


    const [showSetting, setShowSetting] = useState(false);
    
    const [newMessage, setNewMessage] = useState("");
    const { data, loading, error, isSuccess, execute } = usePost();
    function handleSubmit() {
        if (newMessage.trim() === "") return;
        const userMessage = {
            message: newMessage,
            isAi: false
        };

        setMessages(prev => [...prev, userMessage]);
        const formData = new FormData();
        formData.append("message", newMessage);
        execute("chat-bot", formData);
        setNewMessage("");
    }

    useEffect(() => {
        if (data && !loading) {
            setMessages(data?.data);
        }
    }, [data, loading])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const showMessages = messages?.map((message, index) => (
        <li ref={messageRef} className={message.isAi ? Style.left : Style.right} key={index}>
            <p>{message.message}</p>
        </li>
    ));

    const { data:dataDelete, loading:dataLoading, error:dataError, isSuccess:dataIsSuccess, execute:dataExecute } = useDelete();
    const [confirmation, setConfirmation] = useState(false);
    function handleDelete() {
        setConfirmation(false);
        dataExecute(`chat-bot/${1}`);
    }

    useEffect(() => {
        if (dataDelete && !dataLoading) {
            setMessages([]);
        }
    }, [dataDelete, dataLoading])

    return (
        <section className={Style.sectionMessageContainer}>
            <div className={Style.messageHeader}>
                { width < 999 &&  (<IoMdArrowRoundBack onClick={() => { setShowWhat("convo");  setOpenAi(false)}}></IoMdArrowRoundBack>)}
                <img src={Hero} alt="" />
                <h3>Petlink</h3>
                <IoIosSettings onClick={() => setShowSetting(prev => !prev)}></IoIosSettings>
                
                { showSetting && (<ol className={Style.settingContainer}>
                    <li onClick={() => { setShowSetting(prev => !prev); { setShowWhat("convo");  setOpenAi(false)}}}>Close</li>
                    <li onClick={() => { setShowSetting(prev => !prev); setConfirmation(true); }}>Delete Convo</li>
                                </ol>)
                }
            </div>
            <div className={Style.messagesContainer} onClick={() => setShowSetting(false)}>
                <ol>
                    {showMessages}
                </ol>

                <div>
                    <input type="text" className={Style.sendInput} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                    <button onClick={() => handleSubmit()} className={Style.sendButton}><IoSend className={Style.sendIcon}></IoSend></button>
                </div>
            </div>
            <Modal
                handleSubmit={handleDelete}
                confirmation={confirmation}
                confirmationMsg={"delete"}
                successMsg={dataDelete?.message}
                loading={dataLoading}
                success={false}
                setConfirmation={setConfirmation}
                goTo={"/"}
            ></Modal>
        </section>
    )

}

export default Message
