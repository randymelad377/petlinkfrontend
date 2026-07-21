import Style from "./AdminReport.module.css";
import Hero from "../../assets/signatureImg.png";
import ModalReport from "../../components/adminComponents/report/ModalReport";
import { useEffect, useState } from "react";
import { useGet } from "../../helpers/PetHelper";

function AdminReport() {
    
    const [showReportModal, setShowReportModal] = useState(false);
    const [activeButton, setActiveButton] = useState(false);

    //get
    const [reports, setReports] = useState([]);
    const [report, setReport] = useState({});

    const { data, error, isLoading } = useGet("reports");

    useEffect(() => {
        if (data && !isLoading) {
            setReports(data?.data || []);
        }
    }, [data, isLoading])
    //get

    const showReports = reports?.length > 0 ?  reports.filter((report) => activeButton || !report.isRead).map((report) => {
        return (
            <article key={report.report_id} className={Style.reportCard} onClick={() => { setShowReportModal(true);  setReport(report)}}>
                <img className={Style.reporterImg} src={report.reporter_image} alt="" />
                <div className={Style.reportDesc}>
                    <h2 className={Style.reporter}>{report.reporter_name}</h2>
                    <p className={Style.reportWord}>reports</p>
                    <h2 className={Style.reported}>{report.user_name}</h2>
                </div>
                <img className={Style.reportedImg} src={report.user_image} alt="" />
            </article>
        )
    }) : <p>No report.</p>

    return (
        <main className={Style.mainAdminReport}>
            <section className={Style.sectionButtonContainer}>
                <button onClick={() => setActiveButton(true)} className={activeButton ? Style.activeButton : Style.notActiveButton}>All</button>
                <button onClick={() => setActiveButton(false)} className={!activeButton ? Style.activeButton : Style.notActiveButton}>Unread</button>
            </section>
            <section className={Style.reportInnerContainer}>
                {showReports}
            </section>
            {showReportModal && (<ModalReport setShowReportModal={setShowReportModal} setReports={setReports} report={report} setShowReportModal={setShowReportModal} />)}
        </main>
    )

}

export default AdminReport