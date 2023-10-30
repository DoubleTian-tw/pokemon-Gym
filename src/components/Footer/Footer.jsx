import "./Footer.css";
const Footer = () => {
    const date = new Date().getFullYear();
    console.log(date);
    return (
        <footer className="text-white bg-secondary p-3">
            <div className="container">
                <p>Copyright © {date} Pokemon Gym. All Rights Reserved.</p>
            </div>
        </footer>
    );
};
export default Footer;
