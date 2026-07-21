import { useState } from "react";
import Style from "./Modal.module.css";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";

function Modal({ setOpenModal,
                 loading,
                 isSuccess,
                 handleSubmit,
                 goto,
}) {

    const navigate = useNavigate();
    
    return (
        <>
            
            <section className={Style.modalSection}>

            {(!loading && !isSuccess) && (<article className={Style.confirmationOC}>
                                                <div className={Style.crossContainer}>
                                                    <ImCross className={Style.cross} onClick={() => setOpenModal(false)}/>
                                                </div>
                                                <p className={Style.confirmationDesc}>Are you sure you want to submit?</p>
                                                <p className={Style.warning}>This action cannot be undone.</p>
                                                <button type="button" onClick={handleSubmit} className={Style.confirmationBtn}>SUBMIT</button>
                                            </article>)}
            
            {loading && (<article className={Style.loadingOC}>
                            <p className={Style.spiner}></p>
                        </article>)}
                        
            {isSuccess && (<article className={Style.successOC}>
                            <p className={Style.successMsg}>Information Changed. You may change you information again after 30 days.</p>
                            <button type="button" className={Style.confirmationBtn} onClick={() => navigate(goto)}>Home</button>
                </article>)}
                
            </section>
            
        </>
    )

}

export default Modal