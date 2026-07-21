import Style from "./PetLoading.module.css";

function PetLoading() {
    
    const count = [1,2,3,4,5,1,2,3,4,5];

    const displayCardLoading = count.map((pet, index) => {
        return (
            <article className={Style.cardLoadingIC} key={index}>

            </article>  
        );
    });
    return (
            <section className={Style.cardLoadingOC}>
                {displayCardLoading}
            </section>
    )
    
}

export default PetLoading