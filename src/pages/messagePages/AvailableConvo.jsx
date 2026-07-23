import Style from "./AvailableConvo.module.css"; 
import Message from "../../components/messageComponents/Message";
import Hero from "../../assets/signatureImg.png";
import Convo from "../../components/messageComponents/Convo";
import { IoSend } from "react-icons/io5";
import { IoMdImage } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGet, useGetMsg, usePost } from "../../helpers/PetHelper";
import { GiCrossMark } from "react-icons/gi";
import { IoMdAdd } from "react-icons/io";
import MessageAi from "../../components/messageComponents/MessageAi";
import SearchBar from "../../components/others/SearchBar";

function AVailableConvo() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const navFunc = () => {navigate(`/messages?name=${searchBarUser}`)};
    //FOR UI
    const fileInputRef = useRef(null);
    const [width, setWidth] = useState(window.innerWidth);
    const [showWhat, setShowWhat] = useState("convo");

    useEffect(() => {
        const handleSize = () => {
            setWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleSize);

        return () => {
            window.removeEventListener("resize", handleSize);
        }
    }, [])

    const [messageNewUser, setMessageNewUser] = useState(false);
    //FOR UI

    // Get conversation
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    const endpoint = name
    ? `conversation?name=${encodeURIComponent(name)}`
    : "conversation";

    const {
    data: conversations,
    error: conversationError,
    isLoading: conversationIsLoading,
    } = useGet(endpoint);

    const [conversationId, setConversationId] = useState(null);
    //GET CONVERSATION
    
    //GET MESSAGES
    const { data, isLoading, error } = useGetMsg(!conversationId ? null : `message/${conversationId}`);
    //GET MESSAGES

    //GET USERS
    const [searchName, setSearchName] = useState("");
    const [debounceSearch, setDebouceSearch] = useState("");
    const [searchedUsers, setSearchUsers] = useState({});
    const { data: usersData, isLoading: isLoadingData, error: errorData } = useGet(`user/getUsers?name=${searchName}`);

    const [searchUserId, setSearchUserId] = useState(null);
    
    const showSearchResult = usersData?.data.map((user) => (
        <li key={user.public_id} className={searchUserId === user.public_id ? Style.selectedUser : Style.selectedUsers} onClick={() => setSearchUserId(user.public_id)}>
            <img src={user.image ?? Hero}></img>
            <p>{user.name}</p>
        </li>
    ));
    //GET USERS


    //MESSAGE USER NEW
    const [newMessage, setNewMessage] = useState("");
    const [newFileMessage, setNewFileMessage] = useState(null);

    const { data: nmData, loading: nmLoading, error: nmError, isSuccess: nmIsSuccess, execute } = usePost();
    const { data: omData, loading: omLoading, error: omError, isSuccess: omIsSuccess, execute:omExecute } = usePost();
    
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
        
        execute("message", formData).then((result) => { setConversationId(result); });
        setShowWhat("msgs");
        setNewMessage("");
        setMessageNewUser(false);
        setNewFileMessage(null);
        setShowMessage(true);
        setMessageNewUser(false);
    }

    useEffect(() => {
        if (!nmError) {
            setConversationId(nmData?.data)
        }
    }, [nmData])
    //MESSAGE USER NEW

    const [openAi, setOpenAi] = useState(false);
    useEffect(() => {
        if (width < 999) {
            setShowWhat("convo");
        }
    }, [width])
    
    return (
        <main className={Style.main}>
            {(width > 999 || showWhat === "convo") && (<Convo setShowWhat={setShowWhat}
                                                      setMessageNewUser={setMessageNewUser} conversations={conversations?.data} 
                                                      setConversationId={setConversationId}
                                                      setSearchUserId={setSearchUserId}
                                                      setSearchName={setSearchName}
                                                      setOpenAi={setOpenAi}
                                                      ></Convo>)}
                                                      
            {(width > 999 || showWhat === "msgs") && (<Message setShowWhat={setShowWhat}
                                                       width={width} 
                                                       conversation={data?.data}
                                                       setNewMessage={setNewMessage}
                                                       setNewFileMessage={setNewFileMessage}
                                                       newMessage={newMessage}
                                                       newFileMessage={newFileMessage} 
                                                       searchUserId={searchUserId}     
                                                       omExecute={omExecute}                       
                ></Message>)}
            {((width > 999 || showWhat === "aimsgs") && openAi) && (
                <MessageAi setShowWhat={setShowWhat} width={width} setOpenAi={setOpenAi}    ></MessageAi>
            )}
            {messageNewUser && (
                <section className={Style.addMessageOC}>
                    <div className={Style.addMessageIC}>
                        <div className={Style.inputSearchOC}>
                            <div className={Style.inputSearchIC}>
                                <input type="text" onChange={(e) => setDebouceSearch(e.target.value)}/>
                                <FaSearch onClick={() => { setSearchName(debounceSearch);  setSearchUserId(null)}}></FaSearch>
                            </div>
                            <GiCrossMark onClick={() => setMessageNewUser(false)}></GiCrossMark>
                        </div>
                        <ol className={Style.searchedUsersContainer}>
                            {showSearchResult ?? "No users found."}
                        </ol>
                        <div className={Style.sendArea}>
                            <input type="file" style={{ display: "none" }} ref={fileInputRef} onChange={(e) => setNewFileMessage(e.target.files?.[0] || null)}/>
                            <IoMdImage className={Style.sendFile} onClick={() => fileInputRef.current.click()}></IoMdImage>
                            <input type="text" className={Style.sendInput} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}/>
                            <button className={Style.sendButton} onClick={() => handleSubmit()}><IoSend className={Style.sendIcon}></IoSend></button>
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}

export default AVailableConvo