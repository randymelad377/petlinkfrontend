import { useNavigate } from "react-router-dom";
import Style from "./Modal.module.css";
import { GiCrossMark } from "react-icons/gi";

function Modal({ 
    handleSubmit,
    confirmation, 
    accept,
    confirmationMsg,
    successMsg,
    loading,
    success,
    setConfirmation,
    goTo,
    buttonBackName
}) {

    const navigate = useNavigate();
    
    return (
        <>
            {confirmation && (
                <div className={Style.confirmationContainer}>
                    <div className={Style.innerContainer}>
                        <div className={Style.exitConfirmation}>
                            <GiCrossMark onClick={() => setConfirmation(false)} />
                        </div>
                            <p>Are you sure you want to {confirmationMsg}?</p>
                        <button type="button" onClick={() => handleSubmit()} className={Style.submitButton}>Submit</button>
                    </div>
                </div>
                )}
                {loading && (
                    <div className={Style.confirmationContainer}>
                        <div className={Style.innerContainer}>
                            <p>loading...</p>
                        </div>
                    </div>
                )}
                {!loading && success && (
                    <div className={Style.confirmationContainer}>
                        <div className={Style.innerContainer}>
                            <p>{successMsg}</p>
                            <button type="button" className={Style.submitButton}
                                onClick={() => navigate(goTo)}>{buttonBackName || "Home"}</button>
                        </div>
                    </div>
                )}
        </>
    );
}

export default Modal;