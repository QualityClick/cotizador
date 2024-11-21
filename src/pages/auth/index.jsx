import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { auth } from '../../firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { Toaster, toast } from 'sonner';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa6';
import logoPrincipal from '../../assets/imgs/logoSolupatch.png';

import './styles.scss';

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();

  const [passwordShown, setPasswordShown] = useState(false);
  // const [credencialesEquivocadas, setCredencialesEquivocadas] = useState("");

  const tooglePasswordShow = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = (data, e) => {
    // console.log("</> → data:", JSON.stringify(data));

    const emailValue = getValues('email');
    const passwordValue = getValues('password');

    e.preventDefault();
    signInWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
        // console.log(userCredential);
        const authInfo = {
          emailValue: userCredential.user.email,
          userID: userCredential.user.uid,
          isAuth: true,
        };
        // console.log("</> → authInfo.isAuth:", authInfo.isAuth);
        // console.log(authInfo);
        localStorage.setItem('auth', JSON.stringify(authInfo));
        navigate('/cotizador');
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        if (error.code === 'auth/invalid-credential') {
          // setCredencialesEquivocadas("Correo y/o contraseña equivocados");
          toast.warning('Correo y/o contraseña equivocados');
        }
      });
  };

  // console.log("errors:", errors, "isDirty:", isDirty);

  if (isAuth) {
    return <Navigate to='/cotizador' />;
  }

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
        <form onSubmit={handleSubmit(onSubmit)} className='auth__form'>
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
                {...register('email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className='auth__inputs--input'
                type='text'
              />
              {errors?.email?.type === 'required' && (
                <p className='auth__form--error-message'>
                  Este campo es requerido
                </p>
              )}
              {errors?.email?.type === 'pattern' && (
                <p className='auth__form--error-message'>
                  Ingrese un correo valido
                </p>
              )}
            </div>
            <div className='auth__input--pair'>
              <label className='auth__inputs--label'>
                <FaLock
                  style={{
                    marginRight: '3px',
                    marginTop: '-4px',
                    fontSize: '15px',
                  }}
                />{' '}
                Contraseña
              </label>
              <span
                onClick={tooglePasswordShow}
                className='auth__password--icon'
              >
                {passwordShown ? <FaEyeSlash /> : <FaEye />}
              </span>
              <input
                {...register('password', {
                  required: true,
                })}
                className='auth__inputs--input'
                type={passwordShown ? 'text' : 'password'}
              />
              {errors?.password?.type === 'required' && (
                <p className='auth__form--error-message'>
                  Este campo es requerido
                </p>
              )}
            </div>
          </div>
          <button
            disabled={!isDirty}
            type='submit'
            className='auth__form--button'
          >
            Entrar
          </button>
          <Toaster position='bottom-center' richColors />
          {/* <p className="auth__form--error-credentials">
            {credencialesEquivocadas}
          </p> */}
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
