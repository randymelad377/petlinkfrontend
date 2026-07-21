import Style from "./AdminHome.module.css";
import AvailablePet from "../../components/petComponents/AvailablePet";
import { useGet } from "../../helpers/PetHelper";
import Hero from "../../assets/signatureImg.png";
import AvailableUser from "../../components/userComponents/AvailableUser";
import { useEffect, useState } from "react";
function AdminHome() {
    
    function forSnakecase(str) {
        return str
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase())
        .trim();
    } //JUST A FUNCTION PARA SA LABEL


    const { data, error, isLoading } = useGet("admin/pets/get-statistics");
    const statistics = data?.data?.pets || {};
    const successTransaction = data?.data?.successTransaction  || [];
    const currentTransaction = data?.data?.currentTransaction || [];
    
    const showStatistic = Object.entries(statistics).map(([key, value]) => {
        return (
            <div className={Style.statisticInnerContainer} key={key}>
                <h3 className={Style.statisticName}>{forSnakecase(key)} : </h3>
                <p className={Style.statisticCount}>{value}</p>
            </div>
        )
    });

    const showSuccessTransaction = successTransaction.map((history, index) => {
        return (
            <li key={index} className={Style.transaction}>
                <img src={history.pet_poster_image || Hero} />
                <p>{history.message}</p>
                <img src={history.pet_interested_image || Hero}/>
            </li>
        )
    })
    console.log(successTransaction)
    const showCurrentTransaction = currentTransaction.map((transaction, index) => {
        return (
            <li key={index} className={Style.transaction}>
                <img src={transaction.owner_image || Hero} />
                <p>{transaction.message}</p>
                <img src={transaction.interested_image || Hero}/>
            </li>
        )
    })

    return (
        <main className={Style.adminHome}>
            <section className={Style.firstSection}>
                <article className={Style.welcome}>
                    <h1>Welcome back admin!</h1>
                    <p>Manage users, pets, adoptions, and system activities from one central dashboard.</p>
                </article>
                <article className={Style.statisticArticle}>
                    <h2>Pet Statistic.</h2>
                    <div className={Style.statisticOuterContainer}>
                        {showStatistic}
                    </div>
                </article>
            </section>
            <section className={Style.thirdSection}>
                <article className={Style.successOuterTransaction}>
                    <h2>Success Trasactions.</h2>
                    <ol className={Style.successInnerTransaction}>
                        {showSuccessTransaction}
                    </ol>
                </article>
                <article className={Style.successOuterTransaction}>
                    <h2>Current Trasactions.</h2>
                    <ol className={Style.successInnerTransaction}>
                        {showCurrentTransaction}
                    </ol>
                </article>

            </section>
            <section className={Style.actionBtnOuterContainer}>
                <button>Manage Users</button>
                <button>Manage Pets</button>
                <button>Manage Restriction</button>
                <button>Manage Reports</button>
                <button>View Feedbacks</button>
            </section>
        </main>
    )

}

export default AdminHome