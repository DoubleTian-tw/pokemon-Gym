import { Button, Card, Form } from "react-bootstrap";
import { useThemeContext } from "../components/contexts/useTheme";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

const handleLogin = (e) => {
    e.preventDefault();
    const email = e.currentTarget.elements.loginEmail.value;
    const password = e.currentTarget.elements.loginPassword.value;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            toast("登入成功");
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
};
const Login = () => {
    const { bgColor } = useThemeContext();
    // const [signIn, setSignIn] = useState(false);

    // if (signIn) return <SignIn />;

    return (
        <div style={{ width: "300px", margin: "1.5rem auto" }}>
            <h3>登入</h3>
            <Form
                style={{
                    display: "flex",
                    gap: "20px",
                    flexDirection: "column",
                }}
                onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>信箱</Form.Label>
                    <Form.Control
                        data-bs-theme={bgColor}
                        id="loginEmail"
                        type="email"
                        placeholder="test@example.com"></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>密碼</Form.Label>
                    <Form.Control
                        data-bs-theme={bgColor}
                        id="loginPassword"
                        type="password"
                        placeholder="password"></Form.Control>
                </Form.Group>
                <span>
                    <a href="">忘記密碼</a>
                </span>
                <p>
                    沒有帳號嗎? <Link to="../SignIn">建立帳號</Link>
                </p>
                <div>
                    <span>其他方式登入 : </span>
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
export default Login;
