import Style from "./LayoutError.module.css";
import Hero from "../../assets/signatureImg.png";

function LayoutError({ error }) {

    return (
        <div className={Style.layoutError}>
            <div className={Style.layoutErrorMain}>
                <section className={Style.layoutErrorSection}>
                    <img className={Style.layoutErrorImg} src={Hero} alt="Petlink Image" />
                    <h2 className={Style.layoutErrorH2}>{error.message}</h2>
                </section>
            </div>
        </div>
    )
}

export default LayoutError