import { Route, Routes } from "react-router-dom";
import Login from "./pages/authenticate/Login";
import Register from "./pages/authenticate/Register";
import Header from "./components/Header";
import Profile from "./pages/authenticate/Profile";
import Footer from "./components/Footer";
import Products from "./pages/product/Products";
import RequestPasswordChange from "./pages/authenticate/RequestPasswordChange";
import ResetPasswordChange from "./pages/authenticate/ResetPasswordCheck";
import ResetPassword from "./pages/authenticate/ResetPassword";
import DetailedSearch from "./pages/product/DetailedSearch";
import ProductDetails from "./pages/product/ProductDetails";
import CreateProduct from "./pages/product/CreateProduct";
import UpdateProduct from "./pages/product/UpdateProduct";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/search" element={<DetailedSearch />} />
        <Route
          path="/product/details/:productId"
          element={<ProductDetails />}
        />

        <Route path="/product/create" element={<CreateProduct />} />
        <Route path="/product/update/:id" element={<UpdateProduct />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile/*" element={<Profile />} />

        <Route path="/password/request" element={<RequestPasswordChange />} />
        <Route path="/password/confirm" element={<ResetPasswordChange />} />
        <Route path="/password/change" element={<ResetPassword />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
