import { useRef, useState } from 'react';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';

import logoPrincipal from '../../assets/imgs/logoSolupatch.png';
import iconoCotizador from '../../assets/imgs/ICONO-COTIZADOR.svg';
import iconoWhatsApp from '../../assets/imgs/ICONO-WHATSAPP.svg';
import { FaClipboardList, FaWhatsapp } from 'react-icons/fa6';
import { RxAvatar } from 'react-icons/rx';

import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { useLocation } from 'react-router-dom';

import './NavBar.scss';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const [show, setShow] = useState(false);

  const location = useLocation().pathname;

  const target = useRef(null);

  const navigate = useNavigate();

  const {
    isAuth,
    // userID,
    emailValue,
  } = useGetUserInfo();

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/autenticacion');
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className='cotizaciones__navbar'>
      <a target='_blank'>
        <img
          src={logoPrincipal}
          alt='Logo Solupatch'
          className='cotizaciones__navbar--img'
        />
      </a>
      <div className='navbar__buttons'>
        <a
          onClick={() => {
            location === '/cotizaciones'
              ? navigate('/cotizador')
              : navigate('/cotizaciones');
          }}
        >
          <button className='navbar__button--cotizaciones'>
            <img
              src={iconoCotizador}
              style={{
                // fontSize: '2rem',
                width: '30px',
                marginTop: '-5px',
                marginRight: '-3px',
              }}
              alt='Ícono Cotizador'
            />{' '}
            {location === '/cotizaciones' ? 'COTIZADOR' : 'COTIZACIONES'}
          </button>
        </a>
        <a href='https://wa.link/61fpl2' target='_blank'>
          <button className='navbar__button--cotizaciones'>
            <img
              src={iconoWhatsApp}
              style={{
                width: '30px',
                marginTop: '-5px',
                marginRight: '-3px',
              }}
              alt='Ícono WhatsApp'
            />{' '}
            SOPORTE
          </button>
        </a>
        <div className='navbar__button--cotizaciones-vendedor-container'>
          <button
            className='navbar__button--cotizaciones-vendedor'
            onClick={() => setShow(!show)}
            ref={target}
          >
            <div style={{ display: 'flex' }}>
              <div>
                <div style={{ fontWeight: '900' }}>
                  {emailValue === 'rvl@solupatch.com'
                    ? 'Rodolfo Villalobos'
                    : emailValue === 'aclarrea@solupatch.com'
                    ? 'Ana Larrea'
                    : emailValue === 'jlramos@solupatch.com'
                    ? 'José Ramos'
                    : emailValue === 'lblanco@solupatch.com'
                    ? 'Luis Blanco'
                    : 'Invitado'}
                </div>
                <div style={{ fontWeight: '100' }}>{emailValue}</div>
              </div>
              <div>
                <RxAvatar
                  style={{
                    fontSize: '1.5rem',
                    marginTop: '5px',
                    marginLeft: '10px',
                  }}
                />
              </div>
            </div>
          </button>
          <Overlay target={target.current} show={show} placement='bottom'>
            {(props) => (
              <Tooltip
                id='overlay-example'
                {...props}
                style={{
                  position: 'absolute',
                  marginTop: '5px',
                  backgroundColor: '#afafaf',
                  padding: '10px 45px',
                  borderRadius: 50,
                  cursor: 'pointer',
                  ...props.style,
                }}
                onClick={logout}
              >
                CERRAR SESIÓN
              </Tooltip>
            )}
          </Overlay>
        </div>
      </div>
    </div>
  );
};
