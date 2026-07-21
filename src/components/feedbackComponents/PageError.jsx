import { useRouteError } from "react-router-dom";
import Style from "./PageError.module.css";

function PageError() {
    const error = useRouteError();

    return (
        <div className={Style.container}>
            <div className={Style.card}>
                <h2 className={Style.title}>Something went wrong</h2>

                <pre className={Style.message}>
                    {error?.message || "Unknown error"}
                </pre>
            </div>
        </div>
    );
}

export default PageError;