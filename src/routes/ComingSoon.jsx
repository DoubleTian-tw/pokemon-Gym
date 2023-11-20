import { Container } from "react-bootstrap";
import { useThemeContext } from "../components/contexts/useTheme";

const ComingSoon = () => {
    const { themeColor } = useThemeContext();
    return (
        <section className="text-center fst-italic">
            <Container className={`text-${themeColor}`}>
                <h3>Coming Soon...</h3>
            </Container>
        </section>
    );
};
export default ComingSoon;
