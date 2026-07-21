import Style from "./ModalReport.module.css";
import Hero from "../../../assets/signatureImg.png";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { usePut, useDelete } from "../../../helpers/PetHelper";
import Modal from "../../others/Modal";
import { useNavigate } from "react-router-dom";

function ModalReport({setShowReportModal, setReports, report}) {

    const navigate = useNavigate();
    const [read, setRead] = useState(report?.isRead);

    const { data:dataUpdate, loading, error, isSuccess, execute } = usePut();
    function handleSubmit() {
        const formData = new FormData();
        execute(`reports/${report.report_id}`, formData);
    }

    useEffect(() => {
        if(isSuccess && !loading){
            setReports(dataUpdate?.data || [])
        }
    }, [dataUpdate, loading]);



    const { data:dataDelete, loading:dataLoading, error:dataError, isSuccess:dataIsSuccess, execute:dataExecute } = useDelete();
    const [confirmation, setConfirmation] = useState(false);
    function handleDelete() {
        setConfirmation(false);
        dataExecute(`reports/${report.report_id}`);
        if(dataIsSuccess && !dataLoading){
            setShowReportModal(false);
        }
    }
    
    useEffect(() => {
        if (dataIsSuccess && !dataLoading) {
            setShowReportModal(false);
            setReports(dataDelete?.data || []);
        }
    }, [dataDelete, dataLoading]);
    return (
         <section className={Style.modalReportOuterContainer}>
            <article className={Style.modalReportInnerContainer}>
                <div className={Style.userContainer}>
                    <img src={report?.reporter_image || Hero} alt="" />
                    <h2 onClick={() => navigate(`/admin/users/${report?.user_id}`)}>{report.reporter_name}</h2>
                    <IoClose className={Style.closeIcon} onClick={() => setShowReportModal(false)}></IoClose>
                </div>
                <div className={Style.report}>
                    <img src={report.user_image || Hero} className={Style.feedbackImg} alt="" />
                    <p className={Style.feedbackDesc}> <span>{report.reporter_name} report {report.user_name} : </span> {report.message}</p>
                </div>
                <div className={Style.actionContainer}>
                    <button onClick={() => setConfirmation(true)} className={Style.markBtn}>Delete</button>
                    {!read && (<button onClick={() => { setRead(true); handleSubmit()}} className={Style.markBtn}>Mark as read</button>)}
                    {read && (<button onClick={() => { setRead(false);  handleSubmit()}} className={Style.markBtn}>Mark as unread</button>)}
                </div>
            </article>
              <Modal
                handleSubmit={handleDelete}
                confirmation={confirmation}
                confirmationMsg={"delete"}
                successMsg={dataDelete?.message}
                loading={dataLoading}
                success={false}
                setConfirmation={setConfirmation}
                goTo={""}
                buttonBackName="Back"
            ></Modal>
        </section>
    )
}
export default ModalReport