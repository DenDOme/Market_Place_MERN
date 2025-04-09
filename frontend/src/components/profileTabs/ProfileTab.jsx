import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../stores/slices/authSlice";

const ProfileTab = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-dark rounded-tl-2xl rounded-tr-2xl pt-8">
      <div className="w-full  bg-dark px-6">
        <h1 className="text-white text-3xl font-bold ml-8 mb-6">Профиль</h1>

        <div className="bg-dark p-8 rounded-lg text-white">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-gray-400 rounded mb-4"></div>
            <h2 className="text-xl font-semibold">Здравствуйте</h2>
            <p className="text-sm text-gray-400">Поменять данные аккаунта</p>
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center">
              <label className="block w-2/4 text-white">ФИО</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Напишите здесь ФИО"
                className="w-2/4 p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-3 flex flex-col items-center justify-center">
              <label className="block w-2/4 text-white">Почта</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Напишите здесь почту"
                className="w-2/4 p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-3 flex flex-col items-center justify-center">
              <label className="block w-2/4 text-white">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Напишите здесь пароль"
                className="w-2/4 p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className={`block w-2/4 mt-10 mx-auto p-2 rounded font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-primary"
              }`}
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Подтвердить изменение"}
            </button>
          </form>
        </div>

        <hr className="my-10 border-gray-600" />

        <div className="space-y-2 bg-dark">
          <div className="w-full h-10 bg-gray-700 rounded"></div>
          <div className="w-full h-10 bg-gray-700 rounded"></div>
          <div className="w-full h-10 bg-gray-700 rounded"></div>
          <div className="w-full h-10 bg-gray-700 rounded"></div>

          <div className="w-40 h-6 bg-gray-500 rounded ml-auto mt-6" />
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
