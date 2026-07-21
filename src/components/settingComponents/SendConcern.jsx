import { usePost } from "../../helpers/PetHelper";
import Style from "./SendConcern.module.css";
import { useState } from "react";
import Modal from "../others/Modal";

function SendConcern() {

    const [concern, setConcern] = useState("");
    const [image, setImage] = useState(null);

    const { data, loading, error, isSuccess, execute } = usePost();
    const [confirmation, setConfirmation] = useState(false);
    function handleSubmit() {
        setConfirmation(false);
        const formData = new FormData();

        if (!image && concern.trim() === "") {
            return;
        }

        if (image) {
            formData.append("image", image);
        }
        
        formData.append("message", concern);

        execute("concerns", formData);
    }

    return (
        <section className={Style.sectionConcern}>
            <form className={Style.formConcern}>

                <h2>Send Concern</h2>
                <input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <p>
                    If you are experiencing issues, have questions, or want to report something,
                    send your concern to the admin team. (feel free to attach an image as part of your concern)
                </p>

                <label>Your Concern</label>

                <textarea
                    placeholder="Type your concern here..."
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    className={Style.textarea}
                    required
                />

                <button type="button" onClick={() => setConfirmation(true)} className={Style.button}>
                    Submit Concern
                </button>

            </form>
            <Modal
                handleSubmit={handleSubmit}
                confirmation={confirmation}
                confirmationMsg={"submit"}
                successMsg={data?.message}
                loading={loading}
                success={isSuccess}
                setConfirmation={setConfirmation}
                goTo={"/"}
            ></Modal>
        </section>
    );
}

export default SendConcern;