/* eslint-disable react/prop-types */
// NOTE: Aquí lo que estoy tratando de hacer es agregar un input dinamico desde otro componente, estoy batallando para pasar las props desde el componente AddDynamicInputFields a el componente Cotizador

// NOTE: En cuanto a los inputs ya están funcionando independientes solo falta el placeholder del input 'Cantidad' ya que se renderea por estado y al seleccionar el segundo input, se cambia el estado y tambien se cambia el primer input

import { useForm, useFieldArray } from 'react-hook-form';
import { FaCirclePlus } from 'react-icons/fa6';
import { Toaster, toast } from 'sonner';

import './styles.scss';
import { useEffect } from 'react';
import { useGetCotizaciones } from '../../hooks/useGetCotizaciones';
import { useParams } from 'react-router-dom';

export const AddDynamicInputs = ({ getDataFromChild, stateChanger }) => {
  // const [tipo, setTipo] = useState("");
  // const [precio, setPrecio] = useState("");

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: {
      errors,
      // isSubmitting, isDirty,
    },
  } = useForm({
    defaultValues: {
      dynamicForm: [
        {
          seleccione: '',
          unidad: '',
          cantidad: '',
          precio: '',
          concepto: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dynamicForm',
  });
  //FIXME:: Format Precio input to add commas
  // const handlePrecioChange = (e) => {
  //   const formattedNumber = Number(
  //     e.target.value.replace(/,/g, "").replace(/[A-Za-z]/g, "")
  //   ).toLocaleString();
  //   setPrecio(formattedNumber);
  // };

  const onSaveConcept = (data, e) => {
    e.preventDefault();
    getDataFromChild(data);
    stateChanger(true);
    toast.success('Concepto guardado');
  };

  let { cotizacionId } = useParams();

  const { cotizaciones } = useGetCotizaciones();

  let cotizacionSeleccionada = cotizaciones.find(
    (cotizacion) => cotizacion?.id === cotizacionId
  );
  // console.log(cotizacionSeleccionada);

  useEffect(() => {
    setValue('dynamicForm', cotizacionSeleccionada?.dynamicForm);
  }, [cotizacionSeleccionada, setValue]);

  return (
    <div className='cotizador__container--add-dynamic-inputs'>
      <ul className='dynamic__input--ul'>
        {fields.map((item, index) => {
          const selectValue = getValues(`dynamicForm.${index}.seleccione`);
          return (
            <li
              className={`dynamic__input--li ${
                index > 0 && 'conditional-border'
              }`}
              key={item.id}
            >
              {/* NOTE: Concepto */}
              {/* <div className='cotizador__input--pair'>
                <label className='cotizador__inputs--label'>Concepto</label>

                <input
                  {...register(`dynamicForm.${index}.concepto`, {
                    required: true,
                  })}
                  className='cotizador__inputs--input precio'
                  type='text'
                  // value={precio}
                  // onChange={handlePrecioChange}
                />
                {errors?.concepto?.type === 'required' && (
                  <p className='cotizador__form--error-message'>
                    Este campo es requerido
                  </p>
                )}
              </div> */}
              <div
                className='input_container cotizador__form--inputs'
                key={index}
              >
                {/* NOTE: Seleccione */}
                <div className='cotizador__input--pair cotizador__input--pair--select'>
                  <label className='cotizador__inputs--label'>
                    Seleccione un producto
                  </label>
                  <select
                    {...register(`dynamicForm.${index}.seleccione`, {
                      required: true,
                    })}
                    className='cotizador__inputs--select'
                    // onChange={() => fnchange()}
                  >
                    <option value='25kg Solupatch Bultos'>
                      25kgs Solupatch Bultos
                    </option>
                    <option value='Solupatch a Granel'>
                      Solupatch a Granel
                    </option>
                    <option value='Debastado'>Debastado</option>
                    <option value='Suministro y tendido pg64'>
                      Suministro y tendido pg64
                    </option>
                    <option value='Suministro y tendido pg76'>
                      Suministro y tendido pg76
                    </option>
                    <option value='Impregnación'>Impregnación</option>
                    <option value='Suministro pg64'>Suministro pg64</option>
                    <option value='Traslado carpeta'>Traslado carpeta</option>
                    <option value='Movimientos maquinaria'>
                      Movimientos maquinaria
                    </option>
                    <option value='Emulsión aslfáltica'>
                      Emulsión aslfáltica
                    </option>
                    <option value='Slurry Seal'>Slurry Seal</option>
                  </select>
                  {errors?.seleccione?.type === 'required' && (
                    <p className='cotizador__form--error-message'>
                      Este campo es requerido
                    </p>
                  )}
                </div>
                {/* NOTE: Unidad */}
                <div className='cotizador__input--pair'>
                  <label className='cotizador__inputs--label'>
                    Unidad de medida
                  </label>
                  <input
                    {...register(`dynamicForm.${index}.unidad`, {
                      required: true,
                    })}
                    className='cotizador__inputs--input unidad'
                    type='text'
                  />
                  {errors?.nombre?.type === 'required' && (
                    <p className='cotizador__form--error-message'>
                      Este campo es requerido
                    </p>
                  )}
                </div>
                {/* NOTE: Cantidad */}
                <div className='cotizador__input--pair'>
                  <label className='cotizador__inputs--label'>Cantidad</label>
                  <input
                    {...register(`dynamicForm.${index}.cantidad`, {
                      required: true,
                    })}
                    className='cotizador__inputs--input cantidad'
                    type='number'
                    step='any'
                  />

                  {/* {selectValue === '25kg Solupatch Bultos' && (
                    <span className='cotizador__input--placeholder'>
                      Bultos
                    </span>
                  )}
                  {selectValue === 'Solupatch a Granel' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Debastado' && (
                    <span className='cotizador__input--placeholder'>M2</span>
                  )}
                  {selectValue === 'Suministro y tendido pg64' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Suministro y tendido pg76' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Impregnación' && (
                    <span className='cotizador__input--placeholder'>
                      Litros
                    </span>
                  )}
                  {selectValue === 'Suministro pg64' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Traslado carpeta' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Movimientos maquinaria' && (
                    <span className='cotizador__input--placeholder'>Flete</span>
                  )}
                  {selectValue === 'Emulsión aslfáltica' && (
                    <span className='cotizador__input--placeholder'>
                      Litros
                    </span>
                  )} */}
                  {errors?.cantidad?.type === 'required' && (
                    <p className='cotizador__form--error-message'>
                      Este campo es requerido
                    </p>
                  )}
                </div>
                {/* NOTE: Precio */}

                <div className='cotizador__input--pair'>
                  <label className='cotizador__inputs--label'>Precio</label>
                  <span>$</span>
                  <input
                    {...register(`dynamicForm.${index}.precio`, {
                      required: true,
                    })}
                    className='cotizador__inputs--input precio'
                    type='text'
                    // value={precio}
                    // onChange={handlePrecioChange}
                  />
                  {errors?.precio?.type === 'required' && (
                    <p className='cotizador__form--error-message'>
                      Este campo es requerido
                    </p>
                  )}
                </div>

                {index > 0 && (
                  <button
                    className='cotizador__form--borrar-button'
                    type='button'
                    onClick={() => remove(index)}
                  >
                    x
                  </button>
                )}
              </div>
              <div className='cotizador__form--agregar-button-container'>
                <button
                  className='cotizador__form--agregar-button'
                  type='button'
                  onClick={() => {
                    append({
                      seleccione: '',
                      unidad: '',
                      cantidad: '',
                      precio: '',
                    });
                  }}
                >
                  Agregar concepto <FaCirclePlus style={{ fontSize: '30px' }} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <button
        type='button'
        onClick={handleSubmit(onSaveConcept)}
        className='cotizador__form--guardar-button'
      >
        Guardar Conceptos
      </button>
      <Toaster position='bottom-center' richColors />
    </div>
  );
};
