import { Container, Logo, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const authStatus = useSelector((state) => state.auth?.status) || false;
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <header className="py-4 bg-gradient-to-r from-[#4C00FF] to-[#9A00FF] shadow-md">
      <Container>
        <nav className="flex items-center">
          {/* Move logo to extreme left */}
          <Link to="/" className="mr-6">
            <Logo width="60px" />
          </Link>

          {/* Navigation items on the right */}
          <ul className="flex ml-auto space-x-4">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="w-[120px] h-[40px] flex items-center justify-center text-white font-medium rounded-lg bg-white/20 backdrop-blur-md transition duration-300 hover:bg-white/30"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
