import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: 0, label: "Профиль" },
  { id: 1, label: "Избранное" },
  { id: 2, label: "Заказы" },
  { id: 3, parentId: 2, label: "Активные заказы" },
  { id: 4, parentId: 2, label: "История заказов" },
  { id: 5, label: "Мои товары" },
];

const SideBar = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleChange = (tabId) => {
    setActiveTab(tabId);
    onTabChange(tabId);

    if (tabId === 3) {
      navigate("/profile/current");
    } else if (tabId === 4) {
      navigate("/profile/history");
    }
  };

  return (
    <div className="flex flex-col items-start text-black rounded mb-4 h-full w-64 mt-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={`px-4 py-2 font-bold ${
            tab.parentId ? "ml-2 font-normal mb-1" : ""
          } ${
            activeTab === tab.id
              ? "border-b-[2px] border-blue-600 pb-[1px]"
              : "pb-[3px]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SideBar;
