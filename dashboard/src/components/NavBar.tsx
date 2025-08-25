import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <nav className="p-3">
        <Link to="/" className="font-bold text-lg">Centil</Link>
      </nav>
    </nav>
  );
}

export default NavBar;
