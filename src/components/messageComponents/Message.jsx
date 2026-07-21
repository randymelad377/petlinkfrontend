import Style from "./Message.module.css";
import { IoIosSettings } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import Hero from "../../assets/signatureImg.png";
import Modal from "../others/Modal";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePost, usePut } from "../../helpers/PetHelper";

function Message({ setShowWhat,
    width,
    conversation = {},
    setNewFileMessage,
    setNewMessage,
    newMessage,
    newFileMessage,
    searchUserId,
    omExecute}) {
    
    const [showSetting, setShowSetting] = useState(false);
    const navigate = useNavigate();
    const inputImgRef = useRef();
    
    const receiver = conversation?.receiver;
    const messages = [
        ...(conversation?.currentUserMessages || []),
        ...(conversation?.receiverUserMessages || [])
        ].sort((a, b) => {
        const parseDate = (date) => {
            return new Date(
            date.replace(
                /^(\d{2})-(\d{2})-(\d{2}) (\d{2})-(\d{2}) (AM|PM)$/,
                '20$1-$2-$3 $4:$5 $6'
            )
            );
        };

        return parseDate(a.created_at) - parseDate(b.created_at);
        });
    const showMesages = messages.map((message, index) => {
        const messageP = message.message ? <li className={message.isCurrentUserMessage ? Style.right : Style.left} key={message.id}>
                                            <p>{message.message}</p>
                                        </li> : null; 
        const messageImg = message.image ? <li className={message.isCurrentUserMessage ? Style.right : Style.left} key={message.id}>
                                                <img src={message.image}></img>
                                            </li> : null;
        return (
            <>
                {messageP}
                {messageImg}
            </>
        )
    });


    function handleSubmit() {
        const formData = new FormData();
        formData.append("message", newMessage);
        formData.append("receiver_id", searchUserId);
        
        if (newFileMessage) {
            formData.append("image", newFileMessage);
        }

        if ((!newFileMessage && newMessage.trim() === "") || searchUserId === null) {
            return;
        }
        
        omExecute("message", formData);
        setNewMessage("");
        setNewFileMessage(null);
    }

    const { data:blockData, loading: blockLoading, error:blockError, isSuccess: blockIsSuccess, execute: blockExecute} = usePost();
    const [blockConfirmation, setBlockConfirmation] = useState(false);

    function handleBlock() {
        setBlockConfirmation(false);

        const formData = new FormData();
        formData.append("blocked_user_id", searchUserId);

        blockExecute(`block`, formData);
    }

    useEffect(() => {
        if (blockIsSuccess && !blockLoading) {
             navigate("/setting/blocked_users");
        }
    }, [blockData, blockLoading])
    //api blocked user

    //api delete convo
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const { data: dataUpdate, loading:loadingUpdate, error:errorUpdate, isSuccess:isSuccessUpdate, execute } = usePut();
    
    function handleDelete() {
        setDeleteConfirmation(false);
        const formData = new FormData();
        execute(`message/${conversation?.conversation_id}`, formData);
    }
    //api delete convo


    if (Object.keys(conversation).length === 0) {
        return <p className={Style.sectionMessageContainer} style={{
            background: "inherit",
            border: "none",
            boxShadow: "none",
            justifyContent: "center",
            alignItems: "center"
        }}>Choose conversation.</p>
    }
    return (
        <section className={Style.sectionMessageContainer}>
            <div className={Style.messageHeader}>
                { width < 999 &&  (<IoMdArrowRoundBack onClick={() => setShowWhat("convo")}></IoMdArrowRoundBack>)}
                <img src={receiver?.user_image ?? Hero} alt="" />
                <h3>{receiver?.user_name ?? Hero}</h3>
                <IoIosSettings onClick={() => setShowSetting(prev => !prev)}></IoIosSettings>

                { showSetting &&(<ol className={Style.settingContainer}>
                    <li onClick={() => { setShowSetting(prev => !prev);  setBlockConfirmation(true)}}>Block</li>
                                    <li onClick={() => {setShowSetting(prev => !prev); navigate("/users/" + searchUserId)}}>View User</li>
                    <li onClick={() => { setShowSetting(prev => !prev); setDeleteConfirmation(true)}}>Delete Convo</li>
                                </ol>)
                }
            </div>
            <div className={Style.messagesContainer} onClick={() => setShowSetting(false)}>
                <ol>
                    {showMesages}
                </ol>

                <div>
                    <input type="file" style={{ display: "none" }} ref={inputImgRef} onChange={(e) => setNewFileMessage(e.target.files?.[0] || null)}/>
                    <IoMdImage className={Style.sendFile} onClick={() => inputImgRef.current.click()}></IoMdImage>
                    <input type="text" className={Style.sendInput} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                    <button className={Style.sendButton} onClick={() => handleSubmit()}><IoSend className={Style.sendIcon}></IoSend></button>
                </div>
            </div>
            <Modal
                handleSubmit={handleBlock}
                confirmation={blockConfirmation}
                confirmationMsg={"block this user"}
                successMsg={blockData?.message}
                loading={blockLoading}
                success={false}
                setConfirmation={setBlockConfirmation}
                goTo={"/"}
            ></Modal>
            <Modal
                handleSubmit={handleDelete}
                confirmation={deleteConfirmation}
                confirmationMsg={"delete this conversation"}
                successMsg={dataUpdate?.message}
                loading={loadingUpdate}
                success={isSuccessUpdate}
                setConfirmation={setDeleteConfirmation}
                goTo={"/"}
            ></Modal>
        </section>
    )

}

export default Message
