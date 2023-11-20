import { Container } from "react-bootstrap";
import { useThemeContext } from "../components/contexts/useTheme";

const ComingSoon = () => {
    const { textColor } = useThemeContext();
    return (
        <section className="text-center fst-italic">
            <Container>
                {/* <Container className={`text-${textColor}`}> */}
                <h3>Coming Soon...</h3>
            </Container>
        </section>
    );
};
export default ComingSoon;
