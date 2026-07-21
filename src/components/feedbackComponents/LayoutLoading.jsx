import Style from "./LayoutLoading.module.css";
import Hero from "../../assets/signatureImg.png";

function LayoutLoading() {
    return (
        <div className={Style.layoutLoading}>
            <div className={Style.layoutLoadingMain}>
                <section>
                    <img className={Style.layoutLoadingImg} src={Hero} alt="Petlink Image" />
                    <h2 className={Style.layoutLoadingH2}>PETLINK</h2>
                </section>
            </div>
        </div>
    )
}

export default LayoutLoading