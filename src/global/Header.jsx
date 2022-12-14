import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';

import { getCookieToken, getRefreshToken } from '../shared/Cookie';
import UseGetUser from '../hooks/UseGetUser';
import ClickProfileModal from '../components/Header/ClickProfileModal';
import { __getLogonUser } from '../redux/modules/UserPage';
import instance from '../shared/apis';

import '../elem/Down';
import Notification from '../elem/Notification';
import PostCategories from '../elem/PostCategories';
import logo from '../images/logo.svg';
import { headerPB } from './sound';
import basicImg from '../images/mypage/basicImg.png';

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
  const refreshToken = getRefreshToken();

  const [messageList, setMessageList] = useState([]);
  const [valiData, setValiData] = useState();
  const location = useLocation();

  const dispatch = useDispatch();
  const getLogonUser = useSelector((state) => state?.logonUser);
  const loginUser = getLogonUser?.logonUser?.profileImg;

  //만료토큰 검사
  const validate = async () => {
    try {
      const response = await instance.get(`/validate`);
      setValiData(response);
      if (response?.data?.data?.validate !== 0) return;
      dispatch(__getLogonUser(response?.data?.data?.validate));
    } catch (error) {
      console.log(error);
    }
  };

  //처음 불러오기
  useEffect(() => {
    validate();
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
            alt="로고"
            onClick={() => {
              navigate('/');
              headerPB.play();
            }}
          ></Logo>
          <ProceedingButton
            type="button"
            onClick={() => {
              navigate('/list');
              headerPB.play();
            }}
          >
            PROGRESS
          </ProceedingButton>
          <CompleteButton
            type="button"
            onClick={() => {
              navigate('/CompList');
              headerPB.play();
            }}
          >
            COMPLETE
          </CompleteButton>
          <Box>
            <EventButton
              type="button"
              onClick={() => {
                navigate('/event');
                headerPB.play();
              }}
            >
              EVENT
            </EventButton>
          </Box>

          <PostCategories />
          {valiData && valiData.data.data.validate === 0 ? (
            <>
              <Notification />
              {/* <LoginUserImg> */}
              <ClickProfileModal
                img={!loginUser ? basicImg : loginUser}
                alt=""
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
  margin-right: 50px;
  cursor: pointer;
`;

const ProceedingButton = styled(Button)`
  width: 150px;
  margin-right: 30px;
  background: none;
  font-size: 15px;
  color: #a3a3a3;
  &:hover {
    color: white;
  }
`;

const CompleteButton = styled(Button)`
  width: 150px;
  font-size: 15px;
  margin-right: 40px;
  background: none;
  color: #a3a3a3;
  &:hover {
    color: white;
  }
`;

const Box = styled.div`
  width: 150px;
  margin-right: 320px;
  display: grid;
  place-items: center;
  @media ${({ theme }) => theme.device.laptop} {
    margin-right: 330px;
  }
`;

const EventButton = styled(Button)`
  margin-right: 420px;
  font-size: 15px;
  background: none;
  &:hover {
    color: white;
  }
  width: 8ch;
  animation: typing 2s steps(30), blink 0.1s step-end infinite alternate;
  white-space: nowrap;
  overflow: hidden;
  animation-iteration-count: infinite;
  animation: typing 2.5s 0.1s ease infinite;

  @keyframes typing {
    from {
      width: 0;
    }
  }

  @keyframes blink {
    50% {
      border-color: transparent;
    }
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
