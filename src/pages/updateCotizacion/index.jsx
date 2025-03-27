/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';

import { signOut } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAddFolio } from '../../hooks/useAddFolio';
import { useAddCotizacion } from '../../hooks/useAddCotizacion';
// import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import { useGetFolio } from '../../hooks/useGetFolio';
import { useParams } from 'react-router-dom';
import { useGetCotizaciones } from '../../hooks/useGetCotizaciones';
import { toast } from 'sonner';

import logoPrincipal from '../../assets/imgs/logoSolupatch.png';
import { FaClipboardList, FaWhatsapp } from 'react-icons/fa6';
import { RxAvatar } from 'react-icons/rx';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

import { AddDynamicInputs } from '../../components/addDynamicInputs';
import './styles.scss';
import { NavBar } from '../../components/navBar';

export const UpdateCotizacion = () => {
  // const [tipo, setTipo] = useState("");
  // const [precio, setPrecio] = useState("");
  const [entrega, setEntrega] = useState('');
  const [dataFromDynamicInputs, setDataFromDynamicInputs] = useState('');
  const [conceptoGuardado, setConceptoGuardado] = useState(false);
  const [sumImportes, setSumImportes] = useState('');
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const { addFolio } = useAddFolio();
  const { addCotizacion } = useAddCotizacion();

  // const { cotizaciones } = useGetCotizaciones();
  const { folios } = useGetFolio();

  // const handlePrecioChange = (e) => {
  //   const formattedNumber = Number(
  //     e.target.value.replace(/,/g, "").replace(/[A-Za-z]/g, "")
  //   ).toLocaleString();
  //   setPrecio(formattedNumber);
  // };

  // console.log(precio);

  const handleDataFromChild = (data) => {
    setDataFromDynamicInputs(data);
    let importesArr = data.dynamicForm.map((item) => {
      return Number(item.precio * item.cantidad);
    });
    let sumImportesArr = importesArr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });
    setSumImportes(sumImportesArr);
  };

  const handleEntregaChange = (e) => {
    const formattedNumber = Number(
      e.target.value.replace(/,/g, '').replace(/[A-Za-z]/g, '')
    ).toLocaleString();
    setEntrega(formattedNumber);
  };

  const { isAuth, emailValue } = useGetUserInfo();
  const navigate = useNavigate();

  const folio = { num: Math.random() };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      nombre: '',
      empresa: '',
      celular: '',
      email: '',
      seleccione: '',
      cantidad: '',
      precio: '',
      entrega: '',
      observaciones: '',
      // total: "",
    },
  });
  // FIXME: Review the updateDoc function
  const onSubmit = async (data, e) => {
    // console.log('states> ', conceptoGuardado + isDirty + isSubmitting);
    e.preventDefault();
    try {
      const dataObj = {
        //   status: 'seguimineto',
        total: sumImportes,
        folio: cotizacionSeleccionada?.folio,
        ...data,
        ...dataFromDynamicInputs,
      };
      const docRef = doc(db, 'cotizaciones', cotizacionId);
      await updateDoc(docRef, {
        // FIXME: Here I dont know whats should I pass (dataObj or each property)
        ...dataObj,
      })
        .then(() => {
          toast.warning('Cotizacion actualizada');
          navigate('/cotizaciones');
        })
        .catch(() => {
          toast.warning('Hubo un error en los datos, favor de verificar.');
        });
    } catch (error) {
      // console.log(error);
    }
  };

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

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      navigate('/cotizaciones');
    }
  }, [isSubmitSuccessful, navigate, reset]);

  if (!isAuth) {
    return <Navigate to='/' />;
  }

  // console.log(emailValue);

  let { cotizacionId } = useParams();

  const { cotizaciones } = useGetCotizaciones();

  let cotizacionSeleccionada = cotizaciones.find(
    (cotizacion) => cotizacion?.id === cotizacionId
  );
  // console.log(cotizacionId);

  useEffect(() => {
    setValue('nombre', cotizacionSeleccionada?.nombre);
    setValue('empresa', cotizacionSeleccionada?.empresa);
    setValue('celular', cotizacionSeleccionada?.celular);
    setValue('email', cotizacionSeleccionada?.email);
    setValue('entrega', cotizacionSeleccionada?.entrega);
    setValue('observaciones', cotizacionSeleccionada?.observaciones);
    // setValue('seleccione', cotizacionSeleccionada?.dynamicForm[1]?.seleccione);
    // setValue('cantidad', cotizacionSeleccionada?.cantidad);
    // setValue('precio', cotizacionSeleccionada?.precio);
    // setValue('total', cotizacionSeleccionada?.total);
    // setValue('dynamicForm', cotizacionSeleccionada?.dynamicForm);
  }, [cotizacionSeleccionada, setValue]);

  // console.log(conceptoGuardado);

  return (
    <div className='cotizador'>
      <NavBar />
      <div className='cotizador__body'>
        <div className='cotizador__hero'>
          <h2 className='cotizador__header--title'>EDITAR COTIZACIÓN</h2>
          {/* <p className='cotizador__header--paragraph'>Solupatch Versión 1.0</p> */}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='cotizador__form'>
          <div className='cotizador__form--inputs'>
            <div className='cotizador__input--pair'>
              <label className='cotizador__inputs--label'>Nombre</label>
              <input
                {...register('nombre', {
                  required: true,
                })}
                className='cotizador__inputs--input'
                type='text'
              />
              {errors?.nombre?.type === 'required' && (
                <p className='cotizador__form--error-message'>
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className='cotizador__input--pair'>
              <label className='cotizador__inputs--label'>Empresa</label>
              <input
                {...register('empresa', {
                  required: false,
                })}
                className='cotizador__inputs--input'
                type='text'
              />
              {/* {errors?.empresa?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )} */}
            </div>
            <div className='cotizador__input--pair'>
              <label className='cotizador__inputs--label'>Celular</label>
              <input
                {...register('celular', {
                  // required: true,
                })}
                className='cotizador__inputs--input'
                type='tel'
              />
              {/* {errors?.celular?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )} */}
            </div>
            <div className='cotizador__input--pair'>
              <label className='cotizador__inputs--label'>Correo</label>
              <input
                {...register('email', {
                  // required: true,
                  // pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className='cotizador__inputs--input'
                type='text'
              />
              {/* {errors?.email?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
              {errors?.email?.type === "pattern" && (
                <p className="cotizador__form--error-message">
                  Ingrese un correo valido
                </p>
              )} */}
            </div>
          </div>
          <div className='cotizador__form--inputs2'>
            <div className='cotizador__input--pair'>
              <label className='cotizador__inputs--label'>
                Servicio de entrega
              </label>
              <span>$</span>
              <input
                {...register('entrega', {
                  required: true,
                })}
                className='cotizador__inputs--input precio'
                type='text'
                value={entrega}
                onChange={handleEntregaChange}
                style={{ paddingLeft: '35px' }}
              />
              {errors?.entrega?.type === 'required' && (
                <p className='cotizador__form--error-message'>
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className='cotizador__input--pair'>
              <label className='cotizador__inputs--label'>
                Observaciones generales
              </label>
              <input
                {...register('observaciones', {
                  required: false,
                })}
                className='cotizador__inputs--input precio'
                type='text'
                // value={entrega}
                // onChange={handleEntregaChange}
                style={{ paddingLeft: '35px' }}
              />
              {errors?.observaciones?.type === 'required' && (
                <p className='cotizador__form--error-message'>
                  Este campo es requerido
                </p>
              )}
            </div>
          </div>
          <AddDynamicInputs
            getDataFromChild={handleDataFromChild}
            stateChanger={setConceptoGuardado}
          />

          <button
            disabled={!conceptoGuardado}
            type='submit'
            className='cotizador__form--button'
          >
            GUARDAR CAMBIOS
          </button>
        </form>
      </div>
    </div>
  );
};
