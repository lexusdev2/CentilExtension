function Footer() {
    return (
        <div className="text-center text-sm py-10">
            <div>&copy; 2025 All Rights Reserved</div>
            <div className="flex items-center gap-x-2 justify-center">
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    Terms of Services
                </a>
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    Privacy Policy
                </a>
            </div>
        </div>
    );
}

export default Footer;
