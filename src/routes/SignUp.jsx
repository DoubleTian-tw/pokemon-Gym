import { useState } from "react";
import { InputGroup } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { FaLock } from "react-icons/fa";
import { RiUser5Fill } from "react-icons/ri";
import { useThemeContext } from "../components/contexts/useTheme";
import InputItem from "../components/Login/InputItem";

const SignUp = () => {
    const [validated, setValidated] = useState(false);
    const { bgColor } = useThemeContext();

    const handleOnSubmit = (e) => {
        console.log("submit", e.currentTarget.checkValidity());
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
    };
    return (
        <section className="membership">
            <Form
                id="login-container"
                onSubmit={handleOnSubmit}
                noValidate
                validated={validated}>
                <InputItem
                    icon={<RiUser5Fill />}
                    placeholder="name@example.com"
                    type="email"
                    feedbackInvalid="正確的格式"
                />
                <InputItem
                    icon={<FaLock />}
                    placeholder="密碼"
                    type="password"
                    feedbackInvalid="密碼"
                />
                <InputItem
                    icon={<FaLock />}
                    placeholder="再次輸入密碼"
                    type="password"
                    feedbackInvalid="密碼"
                />

                <Button type="submit">註冊</Button>
            </Form>
        </section>
    );
};
export default SignUp;
