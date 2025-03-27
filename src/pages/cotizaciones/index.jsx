import { useEffect, useRef, useState, useMemo } from 'react';

import { signOut } from 'firebase/auth';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { useGetCotizaciones } from '../../hooks/useGetCotizaciones';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import * as XLSX from 'xlsx';
import { Toaster, toast } from 'sonner';
import Dropdown from 'react-bootstrap/Dropdown';

import logoPrincipal from '../../assets/imgs/logoSolupatch.png';
import {
  FaCircleCheck,
  FaCircleMinus,
  FaCircleXmark,
  FaFilePdf,
  FaRegPenToSquare,
  FaTrash,
  FaCalendarDays,
  FaMagnifyingGlass,
  FaClipboardList,
  FaWhatsapp,
} from 'react-icons/fa6';
import { LuDownload } from 'react-icons/lu';
import { RxAvatar } from 'react-icons/rx';
import '../cotizaciones/styles.scss';
import { MdSave } from 'react-icons/md';
import ClipLoader from 'react-spinners/ClipLoader';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { NavBar } from '../../components/navBar';

export const Cotizaciones = () => {
  const [tempDeleteId, setTempDeleteId] = useState('');
  const [tempUpdateId, setTempUpdateId] = useState('');
  const [nuevoStatus, setNuevoStatus] = useState('');
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [cotizacionesFiltered, setCotizacionesFiltered] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [selectedDate, setSelectedDate] = useState('999999');
  const [finalDate, setFinalDate] = useState([]);
  const [show, setShow] = useState(false);

  const target = useRef(null);

  const {
    isAuth,
    // userID,
    emailValue,
  } = useGetUserInfo();

  const navigate = useNavigate();

  const { cotizaciones } = useGetCotizaciones();

  // NOTE: Excel sheet
  const downloadExcel = () => {
    let table = [
      {
        A: 'FOLIO',
        B: 'CLIENTE',
        C: 'FECHA',
        D: 'VENDEDOR',
        E: 'EMPRESA',
        F: 'EMAIL',
        G: 'CELULAR',
        H: 'MERCANCÍA',
        I: 'CANTIDAD',
        J: 'TOTAL',
      },
    ];
    cotizaciones.forEach((cotizacion) => {
      const formatedDate = () => {
        const { seconds, nanoseconds } = cotizacion?.createdAt || {};
        const Date = moment
          .unix(seconds)
          .add(nanoseconds / 1000000, 'milliseconds');
        moment.locale('es');
        const Fordate = Date.format('DD MM YYYY, h:mm a') || '';
        return Fordate;
      };

      const newArrSeleccione = [];
      if (cotizacion.dynamicForm) {
        newArrSeleccione.push(
          cotizacion.dynamicForm.map((item) => item.seleccione)
        );
      }
      const newArrCantidad = [];
      if (cotizacion.dynamicForm) {
        newArrCantidad.push(
          cotizacion.dynamicForm.map((item) => item.cantidad)
        );
      }

      const {
        nombre,
        id,
        emailValue,
        entrega,
        folio,
        status,
        cantidad,
        precio,
        total,
        // seleccione,
        // empresa,
        // celular,
        // email,
      } = cotizacion;
      let importe = cantidad * 1 * (precio.replace(/,/g, '') * 1);
      let iva = (importe + entrega.replace(/,/g, '') * 1) * 0.16;
      let totalImporte = importe + iva + entrega.replace(/,/g, '') * 1;
      let totalFormated = totalImporte.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      let importeDy = total;
      let ivaDy = (importeDy + entrega.replace(/,/g, '') * 1) * 0.16;
      let totalImporteDy = importeDy + ivaDy + entrega.replace(/,/g, '') * 1;
      let totalFormatedDy = totalImporteDy.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      table.push({
        A: cotizacion.folio,
        B: cotizacion.nombre,
        C: formatedDate(),
        D:
          cotizacion.emailValue === 'rvl@solupatch.com'
            ? 'Rodolfo Villalobos'
            : emailValue === 'aclarrea@solupatch.com'
            ? 'Ana Larrea'
            : emailValue === 'jlramos@solupatch.com'
            ? 'José Ramos'
            : emailValue === 'lblanco@solupatch.com'
            ? 'Luis Blanco'
            : 'Invitado',
        E: cotizacion.empresa,
        F: cotizacion.email,
        G: cotizacion.celular,
        H: cotizacion.dynamicForm
          ? newArrSeleccione
              .map((item) => item)
              .toString()
              .replace(/,/g, '\n')
          : cotizacion.seleccione,
        I: cotizacion.dynamicForm
          ? newArrCantidad
              .map((item) => item)
              .toString()
              .replace(/,/g, '\n')
          : cotizacion.cantidad,
        J: cotizacion.dynamicForm ? totalFormatedDy : totalFormated,
      });
    });

    const finalData = [...table];

    createFilter(finalData);
  };

  const createFilter = (finalData) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(finalData, { skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cotizaciones');
    XLSX.writeFile(workbook, 'Cotizaciones SOLUPATCH.xlsx');
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

  const modalRef = useRef(null);

  const closeModal = () => {
    // console.log(tempDeleteId);
    modalRef.current.close();
  };

  const closeModalOutside = (e) => {
    const dialogDimensions = modalRef.current.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modalRef.current.close();
    }
  };

  // NOTE: DELETE

  const openModal = async (id) => {
    setTempDeleteId(id);
    // console.log(tempDeleteId);
    modalRef.current.showModal();
  };
  const onDelete = async () => {
    const docRef = doc(db, 'cotizaciones', tempDeleteId);
    await deleteDoc(docRef);
    setTempDeleteId('');
    // console.log(tempDeleteId);
    modalRef.current.close();
    toast.warning('Cotización eliminada');
  };

  // NOTE: UPDATE Estado

  const onClickUpdate = (id) => {
    setTempUpdateId(id);
    // console.log('</> → id:', id);
  };

  const onUpdate = async (e, statusFromDropdown) => {
    setShowSaveBtn(true);
    setNuevoStatus(statusFromDropdown);
    // console.log(statusFromDropdown);
    // try {
    //   // console.log(tempUpdateId);
    //   const docRef = doc(db, 'cotizaciones', tempUpdateId);
    //   await updateDoc(docRef, {
    //     status: nuevoStatus,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    // toast.success('Estado actualizado');
    // setShowSaveBtn(false);
  };

  const onUpdateSave = async () => {
    // console.log(nuevoStatus);
    try {
      // console.log(tempUpdateId);
      const docRef = doc(db, 'cotizaciones', tempUpdateId);
      await updateDoc(docRef, {
        status: nuevoStatus,
      });
    } catch (error) {
      // console.log(error);
    }
    toast.success('Estado actualizado');
    setShowSaveBtn(false);
  };

  if (!isAuth) {
    return <Navigate to='/' />;
  }

  const columns = [
    {
      header: 'Folio',
      accessorKey: 'folio',
    },
    {
      header: 'Cliente',
      accessorKey: 'nombre',
    },
    // console.log(moment('2010-10-20').isSameOrBefore('2010-10-21'));
    {
      header: 'Fecha',
      accessorKey: 'createdAt',
      cell: (info) => {
        const { seconds, nanoseconds } = info.cell.row.original.createdAt || {};
        const Date = moment
          .unix(seconds)
          .add(nanoseconds / 1000000, 'milliseconds');
        moment.locale('es');
        const Fordate = Date.format('DD/MM/YYYY') || '';
        return Fordate;
      },
    },
    {
      header: 'Vendedor',
      accessorFn: (row) => {
        if (row.emailValue === 'aclarrea@solupatch.com') {
          return 'Ana Larrea';
        } else if (row.emailValue === 'jlramos@solupatch.com') {
          return 'José Ramos';
        } else if (row.emailValue === 'lblanco@solupatch.com') {
          return 'Luis Blanco';
        } else if (row.emailValue === 'rvl@solupatch.com') {
          return 'Rodolfo Villalobos';
        } else {
          return 'Invitado';
        }
      },
    },
    {
      header: 'Total de Cotización',
      accessorKey: 'precio',
      accessorFn: (row) => {
        let importe = row.cantidad * 1 * (row.precio?.replace(/,/g, '') * 1);
        let iva = (importe + row.entrega?.replace(/,/g, '') * 1) * 0.16;
        let totalImporte = importe + iva + row.entrega?.replace(/,/g, '') * 1;
        let totalFormated = totalImporte.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        let importeDy = row.total;
        let ivaDy = (importeDy + row.entrega?.replace(/,/g, '') * 1) * 0.16;
        let totalImporteDy =
          importeDy + ivaDy + row.entrega?.replace(/,/g, '') * 1;
        let totalFormatedDy = totalImporteDy.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        if (row.dynamicForm) {
          return `$ ${totalFormatedDy}`;
        } else {
          return `$ ${totalFormated}`;
        }
      },
    },
    {
      header: 'Estado',
      accessorKey: '',
      cell: (info) => {
        return (
          <span
            style={{
              display: 'flex',
              position: 'relative',
            }}
          >
            <Dropdown
              onMouseOver={() => {
                onClickUpdate(info.row.original.id);
              }}
            >
              <Dropdown.Toggle
                variant='warning'
                id='dropdown-basic'
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid black',
                  borderRadius: '50px',
                  padding: '1px 6px 1px 0px',
                }}
              >
                {info.row.original.status === 'cancelado' ? (
                  <FaCircleXmark
                    style={{
                      fontSize: '1.5rem',
                      color: '#b62b2be0',
                      backgroundColor: '#fff',
                      borderRadius: '50px',
                      marginLeft: '6px',
                    }}
                  />
                ) : info.row.original.status === 'vendido' ? (
                  <FaCircleCheck
                    style={{
                      fontSize: '1.5rem',
                      color: '#00CA22',
                      backgroundColor: '#fff',
                      borderRadius: '50px',
                      marginLeft: '6px',
                    }}
                  />
                ) : (
                  <FaCircleMinus
                    style={{
                      fontSize: '1.5rem',
                      color: '#FBC512',
                      backgroundColor: '#fff',
                      borderRadius: '50px',
                      marginLeft: '6px',
                    }}
                  />
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ marginLeft: '50px' }}>
                <Dropdown.Item
                  onClick={(e) => {
                    onUpdate(e, 'seguimiento');
                  }}
                  // onMouseOver={() => {
                  //   setTempUpdateId(info.row.original.id);
                  //   console.log(tempUpdateId);
                  // }}
                  value='seguimiento'
                >
                  Seguimiento
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(e) => {
                    onUpdate(e, 'cancelado');
                  }}
                  // onMouseOver={() => {
                  //   setTempUpdateId(info.row.original.id);
                  //   console.log(tempUpdateId);
                  // }}
                  value='cancelado'
                >
                  Cancelado
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(e) => {
                    onUpdate(e, 'vendido');
                  }}
                  // onMouseOver={() => {
                  //   setTempUpdateId(info.row.original.id);
                  //   console.log(tempUpdateId);
                  // }}
                  value='vendido'
                >
                  Vendido
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {showSaveBtn && info.row.original.id === tempUpdateId && (
              <MdSave
                onClick={onUpdateSave}
                style={{
                  width: '25px',
                  height: '25px',
                  color: 'white',
                  backgroundColor: 'black',
                  borderRadius: '50px',
                  padding: '3px',
                  cursor: 'pointer',
                  marginLeft: '5px',
                  fontSize: '20px',
                  position: 'absolute',
                  left: '50px',
                  top: '1.5px',
                }}
              />
            )}
          </span>
        );
      },
    },
    {
      header: 'PDF',
      accessorKey: '',
      cell: (info) => {
        // console.log(
        //   info.row.original.dynamicForm.some(
        //     (obj) => obj.seleccione === '25kg Solupatch Bultos'
        //   )
        // );
        return (
          <NavLink
            to={
              info.row.original.dynamicForm.some(
                (obj) => obj.seleccione === 'Bacherey'
              )
                ? `/pdf-bacherey/${info.row.original?.id}`
                : `/pdf/${info.row.original?.id}`
            }
            target='_blank'
          >
            <button className='cotizador__button--descargar'>
              {/* <FaFilePdf /> */}
              <p>PDF</p>
            </button>
          </NavLink>
        );
      },
    },
    {
      header: 'EDITAR',
      accessorKey: '',
      cell: (info) => {
        return (
          <NavLink to={`/cotizador-actualizar/${info.row.original?.id}`}>
            <button className='cotizador__button--edit'>
              <FaRegPenToSquare />
            </button>
          </NavLink>
        );
      },
    },
    {
      header: 'Borrar',
      accessorKey: '',
      cell: (info) => {
        return (
          <Button
            onClick={() => openModal(info.row.original.id)}
            className='cotizador__button--delete'
          >
            <FaTrash />
          </Button>
        );
      },
    },
  ];

  // State to filter cotizaciones for each user
  useEffect(() => {
    if (emailValue === 'rvl@solupatch.com') {
      setCotizacionesFiltered(cotizaciones);
    } else {
      setCotizacionesFiltered(
        cotizaciones.filter(
          (cotizacion) => cotizacion?.emailValue === emailValue
        )
      );
    }
  }, [cotizaciones, emailValue]);
  // console.log(cotizacionesFiltered);

  const startDate = useMemo(
    () =>
      new Date(
        `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${
          new Date().getUTCDate() + 1
        }`
      ),
    []
  );

  const endDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - selectedDate);
    return new Date(
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getUTCDate()}`
    );
  }, [selectedDate]);

  const dateFilteredData = useMemo(
    () =>
      cotizacionesFiltered.filter((item) => {
        const date = new Date(item?.createdAt?.seconds * 1000);
        return date <= startDate && date >= endDate;
      }),
    [cotizacionesFiltered, startDate, endDate]
  );

  // console.log(dateFilteredData);
  // console.log(cotizacionesFiltered);

  const table = useReactTable({
    data: dateFilteredData.reverse(),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    initialState: {
      pagination: {
        pageSize: 50, //custom default page size
      },
    },
  });

  return (
    <div className='cotizaciones-container'>
      <Dropdown />
      <div className='cotizaciones'>
        {/* Delete Modal */}
        <dialog
          onClick={closeModalOutside}
          ref={modalRef}
          className='cotizaciones__modal'
        >
          <div>
            <h3>Eliminar Cotización</h3>
            <p>
              Si elimina esta cotización los datos no podrán ser recuperados.
            </p>
            <div className='cotizaciones__modal--buttons-container'>
              <button
                className='cotizaciones__modal--delete-button'
                onClick={onDelete}
              >
                Eliminar
              </button>
              <button
                className='cotizaciones__modal--close-button'
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </dialog>
        <NavBar />
        <div className='cotizaciones__body'>
          {cotizacionesFiltered.length > 0 ? (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '90%',
                }}
              >
                {/* <button
                  className='navbar__button--cotizaciones-excel'
                  onClick={downloadExcel}
                >
                  <LuDownload /> DESCARGAR EXCEL
                </button> */}
              </div>
              <div
                className='cotizaciones__header'
                // style={{
                //   display: 'flex',
                //   justifyContent: 'space-between',
                //   width: '100%',
                // }}
              >
                <h5
                  style={{
                    textAlign: 'center',
                    paddingTop: '8px',
                    fontFamily: 'GalanoGrotesqueBold',
                  }}
                >
                  COTIZACIONES GENERADAS
                </h5>
                <div className='cotizaciones__filter-container'>
                  <div style={{ position: 'relative' }}>
                    <FaMagnifyingGlass
                      style={{
                        color: 'black',
                        fontSize: '17.5px',
                        position: 'absolute',
                        left: '15px',
                        top: '10px',
                      }}
                    />
                    <input
                      type='text'
                      placeholder='Buscar...'
                      className='cotizaciones__buscar-input'
                      value={filtering}
                      onChange={(e) => setFiltering(e.target.value)}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <FaCalendarDays
                      style={{
                        color: 'black',
                        fontSize: '17.5px',
                        position: 'absolute',
                        left: '15px',
                        top: '10px',
                      }}
                    />
                    <select
                      name='selectedDate'
                      id='selectedDate'
                      className='cotizaciones__buscar-select'
                      onChange={(e) => setSelectedDate(e.target.value)}
                    >
                      <option value='999999'>Seleccione un rango</option>
                      <option value='7'>Últimos 7 Días</option>
                      <option value='15'>Últimos 15 Días</option>
                      <option value='30'>Últimos 30 Días</option>
                    </select>
                  </div>
                  <button
                    className='navbar__button--cotizaciones-excel'
                    onClick={downloadExcel}
                  >
                    <LuDownload /> DESCARGAR EXCEL
                  </button>
                </div>
              </div>
              <div className='cotizaciones__table-container'>
                <table>
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}{' '}
                            {
                              { asc: '⭡', desc: '⭣' }[
                                header.column.getIsSorted() ?? null
                              ]
                            }
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='footer__pagination'>
                <p
                // style={{
                //   textAlign: 'center',
                //   marginTop: '2rem',
                //   color: '#717171',
                // }}
                >
                  Solupatch © Todos los derechos reservados
                </p>
                <div className='cotizaciones__paginationButtons'>
                  <button onClick={() => table.setPageIndex(0)}>
                    &lt;&lt;
                  </button>
                  <button onClick={() => table.previousPage()}>&lt;</button>
                  <span style={{ marginLeft: '9px' }}>
                    {'  '} {table.getState().pagination.pageIndex + 1} de{' '}
                    {table.getPageCount()}
                  </span>
                  <button onClick={() => table.nextPage()}>&gt;</button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  >
                    &gt;&gt;
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className='pdf__loader__spinner'>
              <ClipLoader color='#fac000' size={50} />
              <div className='pdf__loader__text'>Cargando...</div>
            </div>
          )}
        </div>
        <Toaster position='bottom-center' richColors />
      </div>
    </div>
  );
};
