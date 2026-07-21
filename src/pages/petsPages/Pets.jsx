import Style from "./Pets.module.css";
import { IoMdAdd } from "react-icons/io";
import SearchBar from "../../components/others/SearchBar";
import AvailablePet from "../../components/petComponents/AvailablePet";
import { ImCross } from "react-icons/im";
import { useEffect, useState } from "react";
import { useGet, usePost } from "../../helpers/PetHelper";
import PetAi from "../../components/petComponents/PetAi";
import Modal from "../../components/others/Modal";

function Pets() {
    
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(`status=rehome`);

    const { data: dataGet, isLoading: isLoadingGet, error: errorGet } = useGet(`pets?${status}&${search}`);
 
    const [showForm, setShowForm] = useState(false);

    //function to convert key name into readable
    function convertKey(key) {
        return key.replace(/([A-Z])/g, " $1")
                  .replace(/^./, char => char.toUpperCase());
    }

    function convertCamel(key) {
        return key
            .replace(/([A-Z])/g, "_$1")
            .toLowerCase();
        }

    const [transactionType, setTransctionType] = useState(1);
    const [petInfo, setPetInfo] = useState({
        species: "dog",
        breed: "shitzu",
        color: "white",
        gender: "male",
        age: "2 months"
    })

    const showPetInfoInput = Object.entries(petInfo).map(([key, value]) => (
    <input key={key} type="text" value={value} placeholder={convertKey(key)}
            onChange={(e) =>
                setPetInfo(prev => ({
                    ...prev,
                    [key]: e.target.value
                }))
            }
        />
    ));

    const transactionDetailsMap = {
        1: {
            description: "description ni pet",
            medicalRecord: "medicalRecord ni pet",
            diagnosis: "diagnosis ni pet",
            vaccineRecord: "vaccineRecord ni pet",
            currentMedicines: "currentMedicines ni pet"
        },
        2: {
            description: "description ni pet",
            dateFound: "2026-01-01",
            foundAt: "found at ni pet"
        },
        3: {
            description: "description  ni pet",
            dateLost: "2026-01-01",
            lostAt: "lost at ni  ni pet"
        }
    };

    const [transactionDetails, setTransactionDetails] = useState(transactionDetailsMap[transactionType] || {});

    useEffect(() => {
        setTransactionDetails(transactionDetailsMap[transactionType] || {});
    }, [transactionType]);

    const showPetTransctionInfoInput = Object.entries(transactionDetails).map(([key, value]) => (
        <input key={key} type="text" value={value} placeholder={convertKey(key)} onChange={(e) => setTransactionDetails(prev =>({ ...prev, [key]: e.target.value}))}/>
    ));
    
    const [questions, setQuestions] = useState(["Question 1 ni pet", "Question 2 ni pet", "Question 3 ni pet"])

    const showQuestionsInput = questions.map((question, index) => (
        <input key={index} value={question} type="text" placeholder={question} onChange={e => {
            const prev = [...questions];
            prev[index] = e.target.value;
            setQuestions(prev);
        }}/>
    ))

    const [images, setImages] = useState([]);

    const [confirmation, setConfirmation] = useState(false);
    const { data, loading, error, isSuccess, execute } = usePost();

    function handleSubmit() {
        setConfirmation(false);
        const formData = new FormData();

        // simple fields
        formData.append("transaction_type_id", transactionType);

        // pet info
        Object.entries(petInfo).forEach(([k, v]) => {
            formData.append(k, v);
        });

        // transaction details
        Object.entries(transactionDetails).forEach(([k, v]) => {
            formData.append(convertCamel(k), v);
        });

        // questions (IMPORTANT)
        questions.forEach((q, i) => {
            formData.append(`questions[${i}]`, q);
        });

        // images (IMPORTANT)
        images.forEach((file, i) => {
            formData.append(`images[${i}]`, file);
        });

        execute("pets", formData);
    }


    return (
        <main className={Style.mainPet}>
            <SearchBar search={search} setSearch={setSearch} status={status} setStatus={setStatus}/>
            <AvailablePet pets={dataGet?.data} loading={isLoadingGet}></AvailablePet>
            <button className={Style.addBtn} onClick={() => setShowForm(true)}><IoMdAdd className={Style.addIcon} /></button>
            {showForm && (<form className={Style.addPetFormContainer}>
                <div className={Style.formInnerContainer}>
                    <div className={Style.iconContainer}>
                        <ImCross onClick={() => setShowForm(false)}/>
                    </div>
                    <p className={Style.desc}>Fill up the form below to proceed.</p>
                    <hr />
                    <div className={Style.checkBoxOuterContainer}>
                        <div className={Style.checkBoxContainer}>
                            <input type="radio" defaultChecked name="transactionType" onChange={() => setTransctionType(1)}/><label>Rehome</label>
                        </div>
                        <div className={Style.checkBoxContainer}>
                            <input type="radio" name="transactionType" onChange={() => setTransctionType(2)} /><label>Found</label>
                        </div>
                        <div className={Style.checkBoxContainer}>
                            <input type="radio" name="transactionType" onChange={() => setTransctionType(3)} /><label>Missing</label>
                        </div>
                    </div>
                    
                    {showPetInfoInput}
                    {showPetTransctionInfoInput}
                    <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))}/>
                    <hr />
                    <p className={Style.desc}>Atleast provide three question for interested</p>
                    {showQuestionsInput}
                    {
                        error && <p style={{textAlign:"center", color:"red"}}>{error}</p>
                    }
                    <button type="button" onClick={() => setConfirmation(true)} className={Style.submitBtn}>Submit</button>
                </div>
            </form>)}

            <Modal
                handleSubmit={handleSubmit}
                confirmation={confirmation}
                confirmationMsg={"submit"}
                successMsg={"Please wait for admin to verify."}
                loading={loading}
                success={isSuccess}
                setConfirmation={setConfirmation}
                goTo={"/"}
            />
        </main>
    )

}

export default Pets