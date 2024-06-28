
import './Footer.css'; // Import the CSS file for the Footer

function Footer() {
    return (
        <footer className="footer bg-dark text-light d-flex py-4 justify-content-center align-items-center">
            <p className="mb-0">By Christina Samson {new Date().getFullYear()}</p>
        </footer>
    );
}

export default Footer;
