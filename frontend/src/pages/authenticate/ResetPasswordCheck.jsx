import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  checkPasswordCode,
  setResetToken,
} from "../../stores/slices/authSlice";
import AuthImagePattern from "../../components/AuthImagePattern";

const ResetPasswordChange = () => {
  const [formData, setFormData] = useState({ passcode: "" });
  const { loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(checkPasswordCode(formData.passcode))
      .unwrap()
      .then(() => {
        dispatch(setResetToken(formData.passcode));
        navigate("/password/change");
      })
      .catch((error) => {
        console.error("Password reset code check failed:", error);
      });
  };

  return (
    <div className="container min-h-[calc(100vh-64px-75px)] flex flex-col items-center justify-center bg-white">
      <div className="flex w-full justify-between">
        <div className="w-full max-w-xl items-center bg-dark p-12 py-24 rounded-lg text-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-400 rounded mb-4"></div>
            <h2 className="text-lg font-semibold">Здравствуйте</h2>
            <p className="text-gray-400">Введите код восстановления пароля</p>
          </div>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center">
              <label className="block w-3/4 text-white">
                Код восстановления
              </label>
              <input
                type="text"
                name="passcode"
                value={formData.passcode}
                onChange={handleChange}
                placeholder="Введите ваш код"
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
              {loading ? "Загрузка..." : "Подтвердить код"}
            </button>
          </form>
        </div>

        <AuthImagePattern />
      </div>
    </div>
  );
};

export default ResetPasswordChange;
