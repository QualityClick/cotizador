import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';

import logoPrincipal from '../../assets/imgs/logoSolupatch.png';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa6';
import { Toaster, toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const RestablecerContrasena = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');

  const query = useQuery();
  const oobCode = query.get('oobCode');

  const handleSubmit = async (e) => {
    e.preventDefault();
    confirmPasswordReset(auth, oobCode, newPassword)
      .then(() => {
        toast.success('Contraseña restablecida');
        navigate('/autenticacion');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/weak-password') {
          toast.error('La contraseña debe tener al menos 6 caracteres');
        }
      });
  };

  return (
    <div className='auth'>
      <div className='auth__navbar'>
        <img
          className='auth__navbar--img'
          src={logoPrincipal}
          alt='Solupatch Logo'
        />
      </div>
      <div className='auth__body'>
        <form onSubmit={(e) => handleSubmit(e)} className='auth__form'>
          <div className='auth__form--inputs'>
            <div className='auth__input--pair'>
              <label className='auth__inputs--label'>
                <FaLock
                  style={{
                    marginRight: '3px',
                    marginTop: '-4px',
                    fontSize: '15px',
                  }}
                />{' '}
                Nueva Contraseña
              </label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='auth__inputs--input'
                type='password'
                name='password'
              />
            </div>
          </div>
          <button type='submit' className='auth__form--button'>
            Restablecer Contraseña
          </button>
          <Toaster position='bottom-center' richColors />
        </form>
        <p
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: '#717171',
          }}
        >
          Solupatch © Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};
