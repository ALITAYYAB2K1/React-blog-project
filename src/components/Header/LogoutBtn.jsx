import { useDispatch } from "react-redux";
import authService from "../../appwrite/config";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout());
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <button
      onClick={logoutHandler}
      className="btn btn-danger inline-block px-6 py-2 duration-200 hover:bg-blue-200"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
