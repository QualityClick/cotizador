/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import logoPrincipal from '../../assets/imgs/LOGO-SOLUPATCH.png';
import certificacionesImg from '../../assets/imgs/CERTIFICACIONES.png';
import { FaFacebookF, FaTiktok, FaInstagram } from 'react-icons/fa';
import solupatchWeb from '../../assets/imgs/PAGINA WEB.png';
import ClipLoader from 'react-spinners/ClipLoader';

import '../pdf/styles.scss';
import '../../../src/App.css';
import { useGetCotizaciones } from '../../hooks/useGetCotizaciones';

import moment from 'moment';

import './styles.scss';
import { PDFTr } from './PDFTr';

export const PDF = () => {
  // const navigate = useNavigate();
  const [datePdf, setDatePdf] = useState('');

  let { cotizacionId } = useParams();

  const { cotizaciones } = useGetCotizaciones();

  let cotizacionSeleccionada = cotizaciones.find(
    (cotizacion) => cotizacion?.id === cotizacionId
  );

  console.log('</> → cotizacionSeleccionada:', cotizacionSeleccionada);

  useEffect(() => {
    const { seconds, nanoseconds } = cotizacionSeleccionada?.createdAt || {};
    const Date = moment
      .unix(seconds)
      .add(nanoseconds / 1000000, 'milliseconds');
    moment.locale('es-mx');
    const Fordate = Date.format('DD MM YYYY, h:mm a') || '';
    setDatePdf(Fordate);
  }, [cotizacionSeleccionada]);

  const pdfRef = useRef();

  let entrega = cotizacionSeleccionada?.entrega.replace(/,/g, '') * 1;
  let entregaFormated = entrega.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  let importe =
    cotizacionSeleccionada?.cantidad *
    cotizacionSeleccionada?.precio.replace(/,/g, '');
  let importeFormated = importe.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let iva = (importe + entrega) * 0.16;
  let ivaFormated = iva.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let total = importe + entrega + iva;
  let totalFormated = total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [importeDy, setImporteDy] = useState('');
  const fromPdfChild = (data) => {
    setImporteDy(data);
  };
  let ivaDy = (importeDy + entrega) * 0.16;
  let ivaDyFormated = ivaDy.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let importeDyFormated = importeDy.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let totalDy = importeDy + entrega + ivaDy;
  let totalDyFormated = totalDy.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const downloadPDF = () => {
    const input = pdfRef.current;
    // const style = document.createElement("style");
    // document.head.appendChild(style);
    // style.sheet?.insertRule(
    //   "body > div:last-child img { display: inline-block; }"
    // );
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`${cotizacionSeleccionada?.nombre}-Cotizacion.pdf`);
    });
  };
  const printPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      window.open(pdf.output('bloburl'));
    });
  };
  // NOTE: Listado de vendedores
  const vendedores = () => {
    if (cotizacionSeleccionada?.emailValue === 'aclarrea@solupatch.com') {
      return (
        <div className='pdf__header__title-vendor'>
          Vendedor: <span>Ana Cristina Larrea</span> <br />
          Celular/Whatsapp: <span>81 8704 8514</span> <br />
          Correo: <span>aclarrea@solupatch.com</span>
        </div>
      );
    }
    if (cotizacionSeleccionada?.emailValue === 'jlramos@solupatch.com') {
      return (
        <div className='pdf__header__title-vendor'>
          Vendedor: <span>José Luis Ramos</span> <br />
          Celular/Whatsapp: <span>81 2580 7799</span> <br />
          Correo: <span>jlramos@solupatch.com</span>
        </div>
      );
    }
    if (cotizacionSeleccionada?.emailValue === 'lblanco@solupatch.com') {
      return (
        <div className='pdf__header__title-vendor'>
          Vendedor: <span>Luis Blanco</span> <br />
          Celular/Whatsapp: <span>81 3091 6138</span> <br />
          Correo: <span>lblanco@solupatch.com</span>
        </div>
      );
    }
    if (cotizacionSeleccionada?.emailValue === 'rvl@solupatch.com') {
      return (
        <div className='pdf__header__title-vendor'>
          Vendedor: <span>Rodolfo Villalobos</span> <br />
          Celular/Whatsapp: <span>81 2201 6300</span> <br />
          Correo: <span>rvl@solupatch.com</span>
        </div>
      );
    }
  };

  return (
    <div>
      {cotizacionSeleccionada ? (
        <div className='pdf__container'>
          <div className='pdf__button__container'>
            <button className='pdf__button' onClick={downloadPDF}>
              Guardar PDF
            </button>
            <button className='pdf__button' onClick={printPDF}>
              Imprimir PDF
            </button>
          </div>
          <div ref={pdfRef} className='pdf'>
            <section className='pdf__header'>
              <div className='pdf__header__img__datos'>
                <img
                  className='pdf__header__img'
                  src={logoPrincipal}
                  alt='Solupatch Logo'
                />
                <div className='pdf__header__cliente__datos'>
                  <div>
                    Cliente: <span>{cotizacionSeleccionada?.nombre}</span>
                  </div>
                  <div>
                    Empresa: <span>{cotizacionSeleccionada?.empresa}</span>
                  </div>
                  <div>
                    Celular: <span>{cotizacionSeleccionada?.celular}</span>
                  </div>
                  <div>
                    Correo: <span>{cotizacionSeleccionada?.email}</span>
                  </div>
                </div>
                <div className='pdf__header__cliente__datos'>
                  {vendedores()}
                </div>
              </div>
              <div className='pdf__header__title'>
                <div style={{ fontWeight: '900' }}>COTIZACIÓN</div>
                <div>{datePdf}</div>
                <div>Folio:{cotizacionSeleccionada?.folio}</div>
                <div>{/* {vendedores()} */}</div>
                <div>
                  <div className='pdf__header__datos'>
                    <div className='pdf__header__datos1'>
                      SOLUPATCH S.A. DE C.V.
                    </div>
                    <div className='pdf__header__datos1'>RFC: SOL231030DX0</div>
                    <div className='pdf__header__datos2'>
                      <span>Dirección:</span> Av.Revolución, 4055,
                      <br /> Local 15, Contry C.P. 64860,
                      <br /> Monterey, Nuevo León, México
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <section className='cliente'>
              <div className='cliente__title__bar'>DATOS DEL CLIENTE</div>
              <hr />
              <div className='cliente__datos'>
                <div className='cliente__datos__pair'>
                  <div>{cotizacionSeleccionada?.nombre}</div>
                  <div>{cotizacionSeleccionada?.empresa}</div>
                </div>
                <div className='cliente__datos__pair'>
                  <div>{cotizacionSeleccionada?.celular}</div>
                  <div>{cotizacionSeleccionada?.email}</div>
                </div>
              </div>
            </section> */}
            <section className='cotizacion'>
              <table
                className='cotizacion__title__bar'
                key={cotizacionSeleccionada.id}
              >
                <thead className='cotizacion__title__thead'>
                  <tr>
                    <th className='cotizacion__title__th'>LÍNEA</th>
                    <th className='cotizacion__title__th'>CONCEPTO</th>
                    <th className='cotizacion__title__th'>CANTIDAD</th>
                    <th className='cotizacion__title__th'>UNIDAD</th>
                    <th className='cotizacion__title__th'>P. UNIDATIO</th>
                    <th className='cotizacion__title__th'>TOTAL</th>
                  </tr>
                </thead>
                <PDFTr
                  cotizaciones={cotizaciones}
                  cotizacionSeleccionada={cotizacionSeleccionada}
                  fromPdfChild={fromPdfChild}
                />
              </table>
              <div className='cotizacion__observaciones'>
                {/* {cotizacionSeleccionada?.observaciones} */}
                <h5>Observaciones Generales</h5> <br />{' '}
                {cotizacionSeleccionada?.observaciones}
              </div>
            </section>
            <section className='total'>
              <div className='banco__datos__img'>
                <div className='banco__datos__text'>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    INFORMACIÓN PARA DEPOSITO TRANSFERENCIA
                  </div>
                  <div>
                    <span>Banco:</span> BBVA
                  </div>
                  <div>
                    <span>Nombre:</span> SOLUPATCH. S.A. de C.V.
                  </div>
                  <div>
                    <span>Clave Interbancaria:</span> 012580001219422986
                  </div>
                  <div>
                    <span>No.Tarjeta:</span> 455513012605665
                  </div>
                  <div>
                    <span>No.Cuenta:</span> 0121942298
                  </div>
                  {/* <div>Coreo: facturacion@solupatch.com</div> */}
                </div>
                {/* <img src={empaqueSolupatch} alt='' /> */}
              </div>
              <div>
                <div className='cotizacion__total__div'>
                  <span className='cotizacion__total__span'>
                    SUBTOTAL:{'  '}
                  </span>{' '}
                  $
                  {cotizacionSeleccionada.dynamicForm
                    ? importeDyFormated
                    : importeFormated}
                </div>
                <div className='cotizacion__total__div'>
                  <span className='cotizacion__total__span'>
                    ENTREGA: {'  '}
                  </span>
                  ${entregaFormated}
                </div>
                <div className='cotizacion__total__div'>
                  <span className='cotizacion__total__span'>
                    IVA 16%: {'  '}
                  </span>
                  $
                  {cotizacionSeleccionada.dynamicForm
                    ? ivaDyFormated
                    : ivaFormated}
                </div>
                <div className='cotizacion__total__div'>
                  <span className='cotizacion__total__span'>TOTAL:{'  '} </span>
                  $
                  {cotizacionSeleccionada.dynamicForm
                    ? totalDyFormated
                    : totalFormated}
                </div>
                <img
                  className='certificaciones__img'
                  src={certificacionesImg}
                  alt='Certificaciones'
                />
              </div>
            </section>
            <section className='observaciones__text'>
              <h5>OBSERVACIONES</h5>
              <ul className='observaciones__ul'>
                <li>Los precios pueden variar después de la visita técnica.</li>
                <li>
                  La garantía se extiende por un año en la carpeta aplicada.
                </li>
                <li>
                  El presupuesto y los precios están basados en el volumen
                  indicado; cualquier variación aumentará el precio.
                </li>
                <li>
                  Se aplica penalización en tiempos muertos de maquinaria y
                  personal.
                </li>
                <li>Los precios serán vigentes durante el mes presente.</li>
                <li>
                  Los trabajos se realizan en base a los conceptos cotizados;
                  cualquier trabajo adicional deberá ser cotizado previamente.
                </li>
                <li>
                  Este presupuesto se verá afectado por incrementos o
                  decrementos de PEMEX.
                </li>
                <li>
                  Nuestro producto incluye garantía absoluta de calidad por
                  escrito e incluye pruebas efectuadas en nuestro laboratorio de
                  control de calidad.
                </li>
              </ul>
              <p>
                La responsabilidad de Solupatch termina una vez firmada de
                conformidad la remisión de entrega. Si existe alguna observación
                respecto al servicio o material, favor de anotarlo en la
                remisión de entrega e informarlo a su asesor comercial al
                momento de la recepción del producto.
              </p>
            </section>

            <section className='footer'>
              <div className='footer__social'>
                <a
                  href='https://www.facebook.com/solupatch'
                  target='_blank'
                  rel='noreferrer'
                >
                  <FaFacebookF />
                </a>
                <a
                  href='https://www.instagram.com/solupatch'
                  target='_blank'
                  rel='noreferrer'
                >
                  <FaInstagram />
                </a>
                <a
                  href='https://www.instagram.com/solupatch'
                  target='_blank'
                  rel='noreferrer'
                >
                  <FaTiktok />
                </a>
              </div>
              <div className='footer__web'>
                <a
                  href='https://www.solupatch.com'
                  target='_blank'
                  rel='noreferrer'
                >
                  <img src={solupatchWeb} alt='Solupatch Web' />
                </a>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className='pdf__loader__spinner'>
          <ClipLoader color='#fac000' size={50} />
          <div className='pdf__loader__text'>Cargando...</div>
        </div>
      )}
    </div>
  );
};
