import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  removeResetToken,
  setError,
} from "../../stores/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthImagePattern from "../../components/AuthImagePattern";

const ResetPassword = () => {
  const { reset_token, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      dispatch(setError("Пароли не совпадают"));
      return;
    }

    const resetData = {
      token: reset_token,
      password: formData.password,
    };

    dispatch(resetPassword(resetData))
      .unwrap()
      .then(() => {
        dispatch(removeResetToken());
        navigate("/login");
      });
  };

  return (
    <div className="container min-h-[calc(100vh-64px-75px)] flex flex-col items-center justify-center bg-white">
      <div className="flex w-full justify-between">
        <div className="w-full max-w-xl items-center bg-dark p-12 py-24 rounded-lg text-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-400 rounded mb-4"></div>
            <h2 className="text-lg font-semibold">Здравствуйте</h2>
            <p className="text-gray-400">Введите новый пароль</p>
          </div>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center">
              <label className="block w-3/4 text-white">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Напишите здесь пароль"
                className="w-3/4 p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col items-center justify-center mt-4">
              <label className="block w-3/4 text-white">
                Подтвердите пароль
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Напишите здесь пароль"
                className="w-3/4 p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            <button
              type="submit"
              className={`block w-3/4 mt-10 mx-auto p-2 rounded font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-primary"
              }`}
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Подтвердить пароль"}
            </button>
          </form>
        </div>

        <AuthImagePattern />
      </div>
    </div>
  );
};

export default ResetPassword;
