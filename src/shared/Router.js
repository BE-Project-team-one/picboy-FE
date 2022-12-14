import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

// pages import
import CompleteDetail from '../pages/CompleteDetail';
import PostFree from '../pages/PostFree';
import PostTopic from '../pages/PostTopic';
import List from '../pages/List';
import Login from '../pages/Login';
import Main from '../pages/Main';
import ProgressDetail from '../pages/ProgressDetail';
import ProgressPost from '../pages/ProgressPost';
import SignUp from '../pages/SignUp';
import UserProfile from '../pages/UserProfile';
import CompList from '../pages/CompList';
import { Context } from './ContextApi';
import Header from '../global/Header';
import PostRelay from '../pages/PostRelay';
import Footer from '../global/Footer';
import KakaoLogin from '../pages/KakaoLogin';
import Event from '../pages/Event';

const Router = () => {
  useEffect(() => {
    window.onbeforeunload = function pushRefresh() {
      window.scrollTo(0, 0);
    };
  }, []);
  return (
    <Context>
      <Header />
      <Routes>
        {/* 종훈님 */}
        <Route path="/" element={<Main />} />
        <Route path="/progressdetail/:id" element={<ProgressDetail />} />
        <Route path="progress-post" element={<ProgressPost />} />
        <Route path="list" element={<List />} />
        <Route path="event" element={<Event />} />

        {/* 민희님 */}
        <Route path="login" element={<Login />} />
        <Route path="join" element={<SignUp />} />
        <Route path="user-profile/:id" element={<UserProfile />} />
        <Route path="user/kakao" element={<KakaoLogin />} />

        {/* 다솜님 */}
        <Route path="complist" element={<CompList />} />
        <Route path="post-free" element={<PostFree />} />
        <Route path="post-topic" element={<PostTopic />} />
        <Route path="post-relay/:id" element={<PostRelay />} />
        <Route path="complete-detail/:id" element={<CompleteDetail />} />
      </Routes>
      <Footer />
    </Context>
  );
};

export default Router;
