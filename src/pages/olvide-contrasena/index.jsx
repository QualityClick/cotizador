import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';

import logoPrincipal from '../../assets/imgs/logoSolupatch.png';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa6';
import { Toaster, toast } from 'sonner';

export const OlvideContrasena = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    sendPasswordResetEmail(auth, email, {
      url: 'https://app-solupatch.com/autenticacion',
    })
      .then(() => {
        toast.success('Revisa tu correo para restablecer tu contraseña');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage, errorCode);
      });

    e.target.reset();
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
                <FaEnvelope
                  style={{
                    marginRight: '3px',
                    marginTop: '-4px',
                    fontSize: '15px',
                  }}
                />{' '}
                Correo
              </label>
              <input
                className='auth__inputs--input'
                type='email'
                name='email'
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
