import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Style from "./Register.module.css";
import { usePostWithImage } from "../../helpers/AuthHelper";
function Register() {

    const navigate = useNavigate();

    const [rawFormData, setRawFormData] = useState({
        firstName: "randy",
        middleName: "melad",
        lastName: "flores",
        gender: "male",
        age: 21,
        houseNumber: "AG",
        street: "rizal",
        barangay: "centro 9",
        contactNumber: "09123456789",
        email: "randy@gmail.com",
        username: "randy@@377",
        password: "password",
        password_confirmation: "password",
        image: ""
    });

    const { data: postData, loading: postLoading, error: postError, isSuccess: postIsSuccess, execute:postExecute } = usePostWithImage();

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(rawFormData).forEach(([key, value]) =>(
            formData.append(key, value)
        ))

        postExecute("user/register", formData);
    }

    useEffect(() => {
        if(postIsSuccess) navigate("/login")
    }, [postIsSuccess])

    return (
        <div className={Style.registerMainContainer}>
            <main className={Style.registerMain}>

                <h1>Register</h1>

                <form onSubmit={handleSubmit} className={Style.formContainer}>
                    <div className={Style.inputOuterContainer}>
                        <input type="text" placeholder="First Name" value={rawFormData.firstName} onChange={(e) => setRawFormData({ ...rawFormData, firstName: e.target.value })} />
                        <input type="text" placeholder="Middle Name" value={rawFormData.middleName} onChange={(e) => setRawFormData({ ...rawFormData, middleName: e.target.value })} />
                        <input type="text" placeholder="Last Name" value={rawFormData.lastName} onChange={(e) => setRawFormData({ ...rawFormData, lastName: e.target.value })} />
                    </div>

                    <div className={Style.inputOuterContainer}>
                        <input type="text" placeholder="Gender" value={rawFormData.gender} onChange={(e) => setRawFormData({ ...rawFormData, gender: e.target.value })} />
                        <input type="number" placeholder="Age" value={rawFormData.age} onChange={(e) => setRawFormData({ ...rawFormData, age: e.target.value })} />
                        <input type="text" placeholder="Contact Number" value={rawFormData.contactNumber} onChange={(e) => setRawFormData({ ...rawFormData, contactNumber: e.target.value })} />
                    </div>

                    <div className={Style.inputOuterContainer}>
                        <input type="text" placeholder="House Number" value={rawFormData.houseNumber} onChange={(e) => setRawFormData({ ...rawFormData, houseNumber: e.target.value })} />
                        <input type="text" placeholder="Street" value={rawFormData.street} onChange={(e) => setRawFormData({ ...rawFormData, street: e.target.value })} />
                        <input type="text" placeholder="Barangay" value={rawFormData.barangay} onChange={(e) => setRawFormData({ ...rawFormData, barangay: e.target.value })} />
                    </div>

                    <div className={Style.inputOuterContainer}>
                        <input type="email" placeholder="Email" value={rawFormData.email} onChange={(e) => setRawFormData({ ...rawFormData, email: e.target.value })} />
                        <input type="text" placeholder="Username" value={rawFormData.username} onChange={(e) => setRawFormData({ ...rawFormData, username: e.target.value })} />
                    </div>

                    <div className={Style.inputOuterContainer}>
                        <input type="password" placeholder="Password" value={rawFormData.password} onChange={(e) => setRawFormData({ ...rawFormData, password: e.target.value })} />
                        <input type="password" placeholder="Confirm Password" value={rawFormData.password_confirmation} onChange={(e) => setRawFormData({ ...rawFormData, password_confirmation: e.target.value })} />
                        <input type="file" onChange={(e) => setRawFormData({ ...rawFormData, image: e.target.files[0] })} />
                    </div>

                    {
                        postLoading && (<p style={{"color" : "black"}} className={Style.serverMsg}>Loading...</p>) 
                    }
                    {
                        postError && (<p className={Style.serverMsg}>{postError}</p>) 
                    }

                    <div className={Style.inputSubmitContainer}>
                        <button type="submit">Submit</button>
                    </div>

                    <div className={Style.termConditionContainer}>
                        <div className={Style.termCondition}>
                            <input type="checkbox" />
                            <label>Terms and Condition</label>
                        </div>
                        <NavLink to="/login">Login</NavLink>
                    </div>
                </form>

            </main>
        </div>
    );
}

export default Register;