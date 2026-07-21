import Style from "./Home.module.css";
import { useGet } from "../../helpers/PetHelper";
import Map from "../../components/map/Map";
import AvailablePet from "../../components/petComponents/AvailablePet";
import { NavLink } from "react-router-dom";


function Home() {

    const { data:petData, isLoading:petIsLoading, error:petError } = useGet("home");
    const rehome = petData?.data?.rehome || [];
    const found = petData?.data?.found || [];
    const missing = petData?.data?.missing || [];

    const { data: clinicData, isLoading: clinicIsLoading, error: clinicError } = useGet("clinic");
    const clinics = clinicData?.data || [];

    return (
        <main className={Style.mainHome}>
            <section className={Style.introSection}>
                <div className={Style.introSentenceContainer}>
                    <h1>Petlink</h1>
                    <p>Search lost and found pets. List details, share identifiers, and help reunite pets with their owners.</p>
                    <div className={Style.buttonContainer}>
                        <a className={Style.button} href="#rehome">Rehome</a>
                        <a className={Style.button} href="#found">Found</a>
                        <a className={Style.button} href="#missing">Missing</a>
                        <NavLink to="/pets" className={Style.button}>View more</NavLink>
                    </div>
                </div>
                <div className={Style.statisticContainer}>
                    <div className={Style.statisticInnerContainer}>
                        <p className={Style.totalPets}>Total items.</p>
                        <div className={Style.statistics}><span>Need new owner pets.</span><span>{rehome.length}</span></div>
                        <div className={Style.statistics}><span>Found pets.</span><span>{found.length}</span></div>
                        <div className={Style.statistics}><span>Lost pets.</span><span>{missing.length}</span></div>
                        <p>Found a pet? Lost your pet? list it.</p>
                    </div>
                </div>
            </section>
            <section id="rehome" className={Style.sectionHomePetContainer}>
                <div className={Style.petTitle}>
                    <p>For rehome pets.</p>
                </div>
                <AvailablePet goto="pets/" pets={rehome}></AvailablePet>
            </section>
            <section id="found" className={Style.sectionHomePetContainer}>
                <div className={Style.petTitle}>
                    <p>Found pets.</p>
                </div>
                <AvailablePet goto="pets/" pets={found}></AvailablePet>
            </section>
            <section id="missing" className={Style.sectionHomePetContainer}>
                <div className={Style.petTitle}>
                    <p>Missing pets.</p>
                </div>
                <AvailablePet goto="pets/" pets={missing}></AvailablePet>
            </section>
                <Map clinics={clinics}></Map>
        </main>
    )
}

export default Home