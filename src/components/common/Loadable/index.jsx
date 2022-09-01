import React, { Suspense } from 'react';
import LogoImg from './../../../assets/images/testandgologo.png';
import styled from 'styled-components';

const Logo = styled.img`
  width: 200px;
  opacity: 0.5;
  transform: scale(0.5);
  animation: rotate 0.8s infinite;
  @keyframes rotate {
    0% {
      opacity: 0.5;
      transform: scale(0.9);
    }
    25% {
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(0.9);
    }
    75% {
      transform: scale(1);
    }
    100% {
      opacity: 0.5;
      transform: scale(0.9);
    }
  }
`;

export const Loadable = (Component) => (props) => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Logo src={LogoImg} alt="loading" />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};
