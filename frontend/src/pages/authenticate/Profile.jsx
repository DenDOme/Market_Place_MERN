import { useState } from "react";
import ProfileTab from "../../components/profileTabs/ProfileTab";
import FavouriteTab from "../../components/profileTabs/FavouriteTab";
import SellingTab from "../../components/profileTabs/SellingTab";
import OrderTab from "../../components/profileTabs/OrderTab";
import SideBar from "../../components/SideBar";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="container min-h-[calc(100vh-64px-75px)] bg-white">
      <div className="flex justify-between items-start mt-10">
        <SideBar onTabChange={setActiveTab} />

        <div className="flex-1">
          {activeTab === 0 && <ProfileTab />}
          {activeTab === 1 && <FavouriteTab />}
          {(activeTab === 2 || activeTab === 3 || activeTab === 4) && (
            <OrderTab />
          )}
          {activeTab === 5 && <SellingTab />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
