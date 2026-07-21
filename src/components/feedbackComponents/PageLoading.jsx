import Style from "./PageLoading.module.css";

function PageLoading() {
    
    return (
        <main className={Style.pageLoading}>
            <p className={Style.spin}></p>
        </main>
    )

}

export default PageLoading;