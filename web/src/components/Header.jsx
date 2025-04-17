import { Link, useLocation } from "react-router-dom";  // Import useLocation
import logo from "../assets/images/logo.svg";

function Header({ handleLogout, isAuthenticated }) {
  const location = useLocation(); // Get the current location (URL path)

  return (
    <header className="border-b py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <img src={logo} width={60} alt="Travel Cards" />
        </Link>
        <div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-xl font-[450]">
              Log Out
            </button>
          ) : (
            // Conditionally render "Sign Up" if we're on the Sign-In page
            <Link className="text-xl font-[450]" to={location.pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
              {location.pathname === "/sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
