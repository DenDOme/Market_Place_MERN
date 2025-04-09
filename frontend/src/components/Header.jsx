import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkUserAuth, logout } from "../stores/slices/authSlice";
import Logo from "../assets/images/logo.svg";
import Login from "../assets/images/login-icon.svg";
import Profile from "../assets/images/profile-icon.svg";
import Logout from "../assets/images/logout-icon.svg";
import SearchIcon from "../assets/images/search.svg";
import DetailsIcon from "../assets/images/details.svg";
import { useNavigate } from "react-router-dom";
import { fetchSearchProducts } from "../stores/slices/productSlice";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleRedirectProfile = () => {
    navigate("/profile");
  };

  const handleRedirectLogin = () => {
    navigate("/login");
  };

  const handleRedirectHome = () => {
    navigate("/");
  };

  const handleRedirectDetails = () => {
    navigate(`/product/search`);
  };

  const handleSearchProducts = () => {
    dispatch(fetchSearchProducts(searchInput));
  };

  return (
    <header className="container w-full flex justify-between items-center py-3 bg-white z-50 relative">
      <div
        onClick={handleRedirectHome}
        className="flex items-center justify-center mb-2 cursor-pointer"
      >
        <img src={Logo} alt="Logo" className="h-7" />
      </div>

      <div className="flex items-center justify-center w-[80%] max-w-[600px] relative">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchInput}
          onChange={handleSearchInput}
          className="w-full py-[6px] pl-[18px] pr-[40px] rounded-[30px] border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRedirectDetails}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2"
        >
          <img src={DetailsIcon} alt="Details" />
        </button>
        <button
          onClick={handleSearchProducts}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2"
        >
          <img src={SearchIcon} alt="Search" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button
              onClick={handleRedirectProfile}
              className="bg-dark hover:bg-[#4e4e4e] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
            >
              <img src={Profile} alt="Profile" className="w-6 h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-dark hover:bg-[#4e4e4e] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
            >
              <img src={Logout} alt="Logout" className="w-6 h-6" />
            </button>
          </>
        ) : (
          <button
            onClick={handleRedirectLogin}
            className="bg-dark hover:bg-[#4e4e4e] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
          >
            <img src={Login} alt="Login" className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
