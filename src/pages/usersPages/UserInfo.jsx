import Style from "./UserInfo.module.css";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineMenu } from "react-icons/md";
import { MdArrowBack } from "react-icons/md";
import Hero from "../../assets/signatureImg.png";
import AvailablePet from "../../components/petComponents/AvailablePet";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGet } from "../../helpers/AuthHelper";
import { usePost } from "../../helpers/PetHelper";
import Modal from "../../components/others/Modal";

function UserInfo() {

    const navigate = useNavigate();
    const param = useParams().public_id;
    const [petType, setPetType] = useState("rehome");
    const { data, error, isLoading } = useGet(`user/get-user-info-pets/${petType}/${param}`);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => { if (!isLoading) setUserInfo(data?.data?.user_info) }, [data])
    
    const [showSetting, setShowSetting] = useState(false);
    const [showReport, setShowReport] = useState(false);

    //API
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    
    const { data:dataStore, loading, error:errorStore, isSuccess, execute } = usePost();
    const [confirmation, setConfirmation] = useState(false);
    function handleSubmit() {
        setConfirmation(false);
        const formData = new FormData();

        if (!image && message.trim() === "") {
            return;
        }

        if (image) {
            formData.append("image", image);
        }
        
        formData.append("message", message);
        formData.append("user_id", param);

        execute("reports", formData);
    }
    //API

    //api blocked user

    const { data:blockData, loading: blockLoading, error:blockError, isSuccess: blockIsSuccess, execute: blockExecute} = usePost();
    const [blockConfirmation, setBlockConfirmation] = useState(false);

    function handleBlock() {
        setBlockConfirmation(false);

        const formData = new FormData();
        formData.append("blocked_user_id", param);

        blockExecute(`block`, formData);
    }

    useEffect(() => {
        if (blockIsSuccess && !blockLoading) {
             navigate("/setting/blocked_users");
        }
    }, [blockData, blockLoading])
    //api blocked user

    return (
        <main className={Style.mainUserInfo} >
            <section className={Style.outerInfoContainer}>
                <MdArrowBack onClick={() => navigate(-1)}></MdArrowBack>
                <div className={Style.imageContainer}>
                    <img src={userInfo?.image || Hero} alt="" className={Style.userImage} />
                    <h2 className={Style.userName}>{userInfo?.name}</h2>
                </div>
                <MdOutlineMenu onClick={() => setShowSetting(prev => !prev)}></MdOutlineMenu>
                
                { showSetting &&(<ol className={Style.settingContainer}>
                                    <li onClick={() => {setShowSetting(prev => !prev); setShowReport(true)}}>Report</li>
                                    <li onClick={() => {setShowSetting(prev => !prev); navigate(`/messages?name=${userInfo?.name}`)}}>Message</li>
                                    <li onClick={() => {setShowSetting(prev => !prev); setBlockConfirmation(true)}}>Block</li>
                                    <li onClick={() => {setShowSetting(prev => !prev); setShowReport(false); setPetType("rehome")}}>Pet to rehome</li>
                                    <li onClick={() => {setShowSetting(prev => !prev); setShowReport(false); setPetType("found")}}>Found Pet</li>
                                    <li onClick={() => {setShowSetting(prev => !prev); setShowReport(false); setPetType("missing")}}>Missing Pet Pet</li>
                                </ol>)
                }
            </section>
            {!showReport && (<AvailablePet pets={data?.data?.user_pets} loading={isLoading} goto={"/pets"}></AvailablePet>)}
            {
                
                showReport && (<form className={Style.reportContainer}>
                                    <div className={Style.reportInnerContainer}>
                                        <input type="file" accept="image/*" className={Style.inputImg} className={Style.reportInput} onChange={(e) => setImage(e.target.files[0])}/>
                                        <textarea placeholder="Write your report and attach an image as a proof..." rows="5" className={Style.reportTextArea} onChange={(e) => setMessage(e.target.value)} />
                                        <button type="button" onClick={() => setConfirmation(true)} className={Style.submitBtn}> Submit</button>
                                    </div>
                                </form>)    
            }

            <Modal
                handleSubmit={handleSubmit}
                confirmation={confirmation}
                confirmationMsg={"submit"}
                successMsg={dataStore?.message}
                loading={loading}
                success={isSuccess}
                setConfirmation={setConfirmation}
                goTo={"/"}
            ></Modal>
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
        </main>
    )
}

export default UserInfo