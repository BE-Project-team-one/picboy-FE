import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useMyContext } from '../shared/ContextApi';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import PostCategories from '../elem/PostCategories';
import logo from '../images/logo.svg';
import {
  getCookieToken,
  removeCookieToken,
  removeRefreshCookieToken,
  getRefreshToken,
} from '../shared/Cookie';
import UseGetUser from '../hooks/UseGetUser';
import ClickProfileModal from '../components/Header/ClickProfileModal';
import basicImg from '../images/mypage/basicImg.png';
import '../elem/Down';
import { __getLogonUser } from '../redux/modules/UserPage';
import { headerPB } from './sound';
import Notification from '../elem/Notification';

const throttle = function (callback, waitTime) {
  let timerId = null;
  return (e) => {
    if (timerId) return;
    timerId = setTimeout(() => {
      callback.call(this, e);
      timerId = null;
    }, waitTime);
  };
};

const Header = () => {
  const myToken = getCookieToken();

  const [messageList, setMessageList] = useState([]);
  const refreshToken = getRefreshToken();

  const location = useLocation();

  const dispatch = useDispatch();
  const getLogonUser = useSelector((state) => state?.logonUser);
  const loginUser = getLogonUser?.logonUser?.profileImg;

  useEffect(() => {
    dispatch(__getLogonUser());
  }, []);

  const navigate = useNavigate();
  const documentRef = useRef(document);

  const [hide, setHide] = useState(false);
  const [pageY, setPageY] = useState(0);

  const handleScroll = () => {
    const { pageYOffset } = window;
    const deltaY = pageYOffset - pageY;
    const hide = pageYOffset !== 0 && deltaY >= 0;
    setHide(hide);
    setPageY(pageYOffset);
  };

  const throttleScroll = throttle(handleScroll, 50);

  useEffect(() => {
    documentRef.current.addEventListener('scroll', throttleScroll);
    return () =>
      documentRef.current.removeEventListener('scroll', throttleScroll);
  }, [pageY]);

  if (location.pathname === '/login') return null;
  if (location.pathname === '/join') return null;

  return (
    <HeaderArea>
      <HeaderContainer className={hide && 'hide'}>
        <HeaderBox>
          <Logo
            src={logo}
            alt=""
            onClick={() => {
              navigate('/');
              headerPB.play();
            }}
          ></Logo>
          <ProceedingButton
            onClick={() => {
              navigate('/list');
              headerPB.play();
            }}
          >
            PROCEEDING
          </ProceedingButton>
          <CompleteButton
            onClick={() => {
              navigate('/CompList');
              headerPB.play();
            }}
          >
            COMPLETE
          </CompleteButton>

          <PostCategories />

          {myToken ? (
            <>
              <Notification />
              {/* <LoginUserImg> */}
              <ClickProfileModal
                img={!loginUser ? basicImg : loginUser}
                onClick={() => {
                  headerPB.play();
                }}
              />
              {/* </LoginUserImg> */}
            </>
          ) : (
            <LoginButton
              onClick={() => {
                navigate('/login');
                headerPB.play();
              }}
            >
              LOGIN
            </LoginButton>
          )}
        </HeaderBox>
      </HeaderContainer>
    </HeaderArea>
  );
};

export default Header;

const Button = styled.button`
  width: 200px;
  height: 50px;
  background: none;
  font-family: 'PopBold';
  font-size: 13px;
  color: white;
`;

const HeaderArea = styled.div`
  position: relative;
  width: 100%;

  z-index: 9999;
`;

const HeaderContainer = styled.div`
  width: 100%;

  margin: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  transition: 0.4s ease;
  &.hide {
    transform: translateY(-80px);
  }
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    #000000;
`;

const HeaderBox = styled.div`
  max-width: 1200px;
  width: 100%;
  height: 80px;
  margin: auto;
  ${({ theme }) => theme.flexSet('row', 'flex-start', 'center')}
`;

const Logo = styled.img`
  width: 104px;
  height: 30px;
  margin-right: 100px;
  cursor: pointer;
`;

const ProceedingButton = styled(Button)`
  width: 150px;
  margin-right: 60px;
  background: none;
  font-size: 15px;
  color: #a3a3a3;
  &:hover {
    color: white;
  }
`;

const CompleteButton = styled(Button)`
  width: 150px;
  margin-right: 420px;
  font-size: 15px;
  background: none;
  color: #a3a3a3;
  &:hover {
    color: white;
  }
`;

const LoginButton = styled(Button)`
  width: 80px;
  ${({ theme }) => theme.backgroundSet('cover')}
  font-size: 12px;
  color: #a3a3a3;
  &:hover {
    color: white;
  }
`;
