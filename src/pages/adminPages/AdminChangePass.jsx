import { useEffect, useState } from "react";
import Style from "../../components/settingComponents/ChangePassword.module.css";
import {useGet, usePost, usePut} from "../../helpers/PetHelper";
import Modal from "../../components/others/Modal";
function AdminChangePass() {

    const { data: codeData, isLoading: codeIsLoading, error: isError } = useGet("user/have-code");
    const [sentCode, setSentCode] = useState(false);
    
    useEffect(() => {
        if (codeData && !codeIsLoading) {
            setSentCode(codeData?.data);
        }
    }, [codeData, codeIsLoading])

    //FOR SEND CODE
    const { data, loading, error, isSuccess, execute } = usePost();
    const [email, setEmail] = useState("");
    function handleSubmit() {
        if (email.trim() === "") return;
        const formData = new FormData();
        formData.append("email", email)
        execute("user/send-code", formData);
    }

    useEffect(() => {
        if (data && !loading) {
            setSentCode(true);
        }
    }, [data, loading]);
    //FOR SEND CODE

    const [newPassword, setNewPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [code, setCode] = useState("");

    const { data:newData, loading:newLoading, error:newError, isSuccess:newIsSuccess, execute:newExecute } = usePut();
    const [confirmation, setConfirmation] = useState(false);
    function handleNewPass() {
        setConfirmation(false);
        newExecute("user/change-pass", { "password": newPassword, "password_confirmation": passwordConfirmation, "code" : code});
    }

  return (
      <main className={Style.section}>
          {!sentCode && (
            <div className={Style.sendCodeOC}>
                <h2>Verify Account</h2>
                <p>Enter your email or phone number to receive a verification code.</p>

                <div className={Style.sendCodeGroup}>
                <input 
                    type="text" 
                          placeholder="Enter email"
                          onChange={(e) => setEmail(e.target.value)}
                      />
                      
                {loading && <p>Loading...</p>}
                {isSuccess && data?.message}
                {error && <p style={{color:"red"}}>{error}</p>}

                <button onClick={() => handleSubmit()}>
                    Send Code
                </button>
                </div>
            </div>
            )}
      {sentCode && (<div className={Style.changePassOC}>
        <h2>Change Password</h2>

        <div className={Style.inputGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className={Style.inputGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
              </div>
              
        <div className={Style.inputGroup}>
          <label htmlFor="newPassword">Code sent your email</label>
          <input
            type="text"
            placeholder="Confirmation code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

              {newIsSuccess && <p>{newData?.message}</p>}
              {newError && <p style={{textAlign:"center", color:"red"}}>{newError}</p>}
              {newLoading && <p>{"Loading..."}</p>}
        <button onClick={() => handleNewPass()} type="button" className={Style.button}>
          Change Password
        </button>
              
      </div>)}
      
          <Modal
                handleSubmit={handleNewPass}
                confirmation={confirmation}
                confirmationMsg={"change password"}
                successMsg={newData?.message}
                loading={newLoading}
                success={newIsSuccess}
                setConfirmation={setConfirmation}
                goTo={"/"}
            ></Modal>
    </main>
  );
}

export default AdminChangePass;