import { InputGroup, Form } from "react-bootstrap";
import { useThemeContext } from "../contexts/useTheme";

const InputItem = ({
    icon,
    placeholder,
    type,
    feedback = "可以",
    feedbackInvalid = "正確資訊",
}) => {
    const { bgColor } = useThemeContext();
    return (
        <InputGroup data-bs-theme={bgColor}>
            <InputGroup.Text>{icon}</InputGroup.Text>
            <Form.Control placeholder={placeholder} type={type} required />
            <Form.Control.Feedback>{feedback}</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
                請輸入{feedbackInvalid}
            </Form.Control.Feedback>
        </InputGroup>
    );
};
export default InputItem;
