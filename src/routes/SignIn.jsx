import { Button, Form } from "react-bootstrap";
import { useThemeContext } from "../components/contexts/useTheme";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
const buttonStyle = {
    borderWidth: "0",
    backgroundColor: "transparent",
    margin: "auto 5px",
};
const iconStyle = {
    width: "30px",
    height: "30px",
    color: "#354698",
};

const handleSignIn = (e) => {
    e.preventDefault();
    const email = e.currentTarget.elements.signInEmail.value;
    const password = e.currentTarget.elements.signInPassword.value;
    // console.log(email, password);
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // console.log(`${user}註冊完畢`);
            toast("註冊成功!");
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage = error.message;

            switch (errorCode) {
                case "auth/invalid-email":
                    errorMessage = "請確認您的email格式是否正確";
                    break;
                case "auth/email-already-exists":
                    errorMessage = "此email被註冊過囉!";
                    break;
                case "auth/weak-password":
                    errorMessage = "密碼至少6位數以上";
                    break;

                default:
                    break;
            }
            toast.error(errorMessage);
        });
};

const SignIn = () => {
    const { bgColor } = useThemeContext();
    return (
        <div style={{ width: "300px", margin: "1.5rem auto" }}>
            <h3>註冊</h3>
            <Form
                onSubmit={handleSignIn}
                style={{
                    display: "flex",
                    gap: "20px",
                    flexDirection: "column",
                }}>
                <Form.Group>
                    <Form.Label>信箱</Form.Label>
                    <Form.Control
                        required
                        data-bs-theme={bgColor}
                        id="signInEmail"
                        type="email"
                        placeholder="test@example.com"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>密碼</Form.Label>
                    <Form.Control
                        required
                        data-bs-theme={bgColor}
                        id="signInPassword"
                        type="password"
                        placeholder="password"></Form.Control>
                </Form.Group>
                <p>
                    已經有帳號? <Link to="../Login">登入</Link>
                </p>
                <div>
                    <span>其他方式註冊 : </span>
                    <button style={buttonStyle}>
                        <FcGoogle style={iconStyle}></FcGoogle>
                    </button>
                    <button style={buttonStyle}>
                        <FaFacebook style={iconStyle}></FaFacebook>
                    </button>
                </div>
                <Button
                    as="input"
                    type="submit"
                    value="確認"
                    variant="primary"
                />
            </Form>
        </div>
    );
};
export default SignIn;
