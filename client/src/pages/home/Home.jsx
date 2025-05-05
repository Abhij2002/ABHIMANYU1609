/* eslint-disable no-unused-vars */
import React from 'react';
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
    return (
        <div className=' rounded-[1rem] bg-white'>
        <div className='flex flex-col sm:flex-row h-[43.2rem] w-[95rem] bg-black-400 backdrop-filter bg-opacity-0'>
            <Sidebar />
            <MessageContainer />
        </div>
        </div>
    );
};

export default Home;
