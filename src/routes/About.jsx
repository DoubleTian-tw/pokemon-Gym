import { Col, Container, Row } from "react-bootstrap";
import avatar from "../images/personal-avatar.jpg";
import { useThemeContext } from "../components/contexts/useTheme";
const About = () => {
    const { themeColor } = useThemeContext();
    return (
        <section className="text-center">
            <Container className={`text-${themeColor}`}>
                <h1>關於</h1>
                <hr />
                {/* <h1 className={`text-${themeColor}`}>關於</h1> */}
                {/* <div className="pt-5 d-none d-md-block">
                <h1>About us</h1>
            </div> */}
                <Row className="justify-content-md-center">
                    <Col md="5">
                        <p>
                            Pokemon
                            Gym是一款在打道館時，可以快速選擇相抗衡角色的網頁工具。
                        </p>
                    </Col>
                    <Col md="5">
                        <p>
                            開發理念在於不需要記下屬性相抗表、角色屬性，只需要透過搜尋、選擇，自動幫使用者帶出推薦的資料，節省查詢角色、開新視窗，進一步透過塞選屬性功能，在多選時也能夠帶出推薦的屬性。
                        </p>
                    </Col>
                </Row>
                <Row className="justify-content-md-center align-items-end">
                    <Col md="auto">
                        <img id="avatar" src={avatar} alt="personal avatar" />
                    </Col>
                    <Col md="6">
                        <div style={{ fontSize: "0.8rem" }}>
                            本網頁由PaddyTian獨立開發，使用JavaScript,
                            React開發，了解更多可以留言私訊。
                        </div>
                    </Col>
                </Row>

                {/* <Col lg="auto">Variable width content</Col> */}
            </Container>
        </section>
    );
};
export default About;
