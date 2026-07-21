import Style from "./Footer.module.css";

function Footer() {
    
    return (
        <footer className={Style.footerContainer}>
            <div className={Style.contacts}>
                <section>
                     <h3>ABOUT PETLINK</h3>
                    <p className={Style.about}>
                        Petlink helps connect pet owners, adopters, and rescuers
                        through pet adoption, lost and found reports, and pet care
                        services in one platform.
                    </p>
                </section>
                <section>
                    <h3>INFO</h3>
                    <ol>
                        <li>Privacy Policy</li>
                        <li>Cookie Policy</li>
                        <li>Site Map</li>
                        <li>Contact Us</li>
                    </ol>
                </section>

                <section>
                    <h3>CONTACT</h3>
                    <ol>
                        <li>Mon - Fri ; 9AM - 5PM</li>
                        <li>
                            <a className={Style.email} href="mailto:randyflores377@gmail.com">
                                randyflores377@gmail.com
                            </a>
                        </li>
                        <li>09457623840</li>
                    </ol>
                </section>

                <section>
                    <h3>ADDRESS</h3>
                    <ol>
                        <li>Centro 9, Barangay Hall</li>
                    </ol>
                </section>
            </div>

            <div className={Style.copyRightContainer}>
                <h3 className={Style.copyRight}>
                    © {new Date().getFullYear()} Petlink
                </h3>
            </div>
        </footer>
    )

}

export default Footer