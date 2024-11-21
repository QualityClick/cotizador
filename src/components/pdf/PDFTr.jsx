/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom';

export const PDFTr = ({
  cotizaciones /*cotizacionSeleccionada*/,
  fromPdfChild,
}) => {
  let { cotizacionId } = useParams();

  let cotizacionSeleccionada = cotizaciones.find(
    (cotizacion) => cotizacion?.id === cotizacionId
  );

  // NOTE:: Datos formateados

  let importe =
    cotizacionSeleccionada?.cantidad *
    cotizacionSeleccionada?.precio.replace(/,/g, '');
  let importeFormated = importe.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let precio = cotizacionSeleccionada?.precio.replace(/,/g, '') * 1;
  let precioFormated = precio.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (cotizacionSeleccionada?.dynamicForm) {
    let preciosArr = cotizacionSeleccionada.dynamicForm.map((item) => {
      return item.precio * 1 * item.cantidad;
    });
    let sumImportes = preciosArr.reduce((a, b) => {
      return a + b;
    });
    fromPdfChild(sumImportes);
  } else {
    null;
  }

  console.log(cotizacionSeleccionada.id);

  return (
    <>
      {cotizacionSeleccionada.dynamicForm ? (
        cotizacionSeleccionada.dynamicForm.map((dynamicForm, i) => {
          // NOTE:: Datos formateados
          let importeDy =
            dynamicForm?.cantidad * dynamicForm?.precio.replace(/,/g, '');

          let importeFormatedDy = importeDy.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          let precioDy = dynamicForm?.precio.replace(/,/g, '') * 1;

          let precioFormatedDy = precioDy.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return (
            // <table
            //   className='cotizacion__title__bar'
            //   key={cotizacionSeleccionada.id}
            // >
            //   <thead className='cotizacion__title__thead'>
            //     <tr>
            //       <th className='cotizacion__title__th'>LÍNEA</th>
            //       <th className='cotizacion__title__th'>CONCEPTO</th>
            //       <th className='cotizacion__title__th'>CANTIDAD</th>
            //       <th className='cotizacion__title__th'>UNIDAD</th>
            //       <th className='cotizacion__title__th'>P. UNIDATIO</th>
            //       <th className='cotizacion__title__th'>TOTAL</th>
            //     </tr>
            //   </thead>
            <tbody className='cotizacion__title__tbody'>
              <tr className='cotizacion__title__tr'>
                <td className='cotizacion__title__td'>{i + 1}</td>
                <td className='cotizacion__title__td'>
                  {dynamicForm?.seleccione}
                </td>
                <td className='cotizacion__title__td'>
                  {dynamicForm?.cantidad}
                </td>
                <td className='cotizacion__title__td'>
                  {dynamicForm?.unidad ? (
                    <span className='cotizador__input--placeholder'>
                      {dynamicForm?.unidad}
                    </span>
                  ) : (
                    <div>
                      {dynamicForm?.seleccione === '25kg Solupatch Bultos' && (
                        <span className='cotizador__input--placeholder'>
                          Bultos
                        </span>
                      )}
                      {dynamicForm?.seleccione === 'Solupatch a Granel' && (
                        <span className='cotizador__input--placeholder'>
                          Toneladas
                        </span>
                      )}
                      {dynamicForm?.seleccione === 'Debastado' && (
                        <span className='cotizador__input--placeholder'>
                          M2
                        </span>
                      )}
                      {dynamicForm?.seleccione ===
                        'Suministro y tendido pg64' && (
                        <span className='cotizador__input--placeholder'>
                          Toneladas
                        </span>
                      )}
                      {dynamicForm?.seleccione ===
                        'Suministro y tendido pg76' && (
                        <span className='cotizador__input--placeholder'>
                          Toneladas
                        </span>
                      )}
                      {dynamicForm?.seleccione === 'Impregnación' && (
                        <span className='cotizador__input--placeholder'>
                          Litros
                        </span>
                      )}
                      {dynamicForm?.seleccione === 'Suministro pg64' && (
                        <span className='cotizador__input--placeholder'>
                          Toneladas
                        </span>
                      )}
                      {dynamicForm?.seleccione === 'Traslado carpeta' && (
                        <span className='cotizador__input--placeholder'>
                          Toneladas
                        </span>
                      )}
                      {dynamicForm?.seleccione === 'Movimientos maquinaria' && (
                        <span className='cotizador__input--placeholder'>
                          Flete
                        </span>
                      )}
                      {dynamicForm?.seleccione === 'Emulsión aslfáltica' && (
                        <span className='cotizador__input--placeholder'>
                          Litros
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className='cotizacion__title__td'>$ {precioFormatedDy}</td>
                <td className='cotizacion__title__td'>$ {importeFormatedDy}</td>
              </tr>
            </tbody>
            // </table>
          );
        })
      ) : (
        // <table className='cotizacion__title__bar'>
        //   <thead className='cotizacion__title__thead'>
        //     <tr>
        //       <th className='cotizacion__title__th'>LÍNEA</th>
        //       <th className='cotizacion__title__th'>CONCEPTO</th>
        //       <th className='cotizacion__title__th'>CANTIDAD</th>
        //       <th className='cotizacion__title__th'>UNIDAD</th>
        //       <th className='cotizacion__title__th'>P. UNIDATIO</th>
        //       <th className='cotizacion__title__th'>TOTAL</th>
        //     </tr>
        //   </thead>
        <tbody
          className='cotizacion__title__tbody'
          key={cotizacionSeleccionada.id}
        >
          <tr className='cotizacion__title__tr'>
            <td className='cotizacion__title__td'>1</td>
            <td className='cotizacion__title__td'>
              {cotizacionSeleccionada?.seleccione}
            </td>
            <td className='cotizacion__title__td'>
              {cotizacionSeleccionada?.cantidad}
            </td>
            <td className='cotizacion__title__td'>
              {cotizacionSeleccionada?.seleccione ===
                '25kg Solupatch Bultos' && (
                <span className='cotizador__input--placeholder'>Bultos</span>
              )}
              {cotizacionSeleccionada?.seleccione === 'Solupatch a Granel' && (
                <span className='cotizador__input--placeholder'>Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione === 'Debastado' && (
                <span className='cotizador__input--placeholder'>M2</span>
              )}
              {cotizacionSeleccionada?.seleccione ===
                'Suministro y tendido pg64' && (
                <span className='cotizador__input--placeholder'>Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione ===
                'Suministro y tendido pg76' && (
                <span className='cotizador__input--placeholder'>Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione === 'Impregnación' && (
                <span className='cotizador__input--placeholder'>Litros</span>
              )}
              {cotizacionSeleccionada?.seleccione === 'Suministro pg64' && (
                <span className='cotizador__input--placeholder'>Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione === 'Traslado carpeta' && (
                <span className='cotizador__input--placeholder'>Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione ===
                'Movimientos maquinaria' && (
                <span className='cotizador__input--placeholder'>Flete</span>
              )}
              {cotizacionSeleccionada?.seleccione === 'Emulsión aslfáltica' && (
                <span className='cotizador__input--placeholder'>Litros</span>
              )}
            </td>
            <td className='cotizacion__title__td'>$ {precioFormated}</td>
            <td className='cotizacion__title__td'>$ {importeFormated}</td>
          </tr>
        </tbody>
        // </table>
      )}
    </>
  );
};
