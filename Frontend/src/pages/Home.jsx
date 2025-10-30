import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className=" h-screen pt-8 flex justify-between flex-col w-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1593950315186-76a92975b60c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dWJlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600')]">
        <img
          className="w-20 ml-7"
          src="https://tse3.mm.bing.net/th/id/OIP.HyOnJV5HD54iXwGVT0z4ggHaDN?pid=Api&P=0&h=180"
          alt="Uber Logo"
        />
        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-3xl font-bold mb-4">Get Started with Race</h2>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-black text-white"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
