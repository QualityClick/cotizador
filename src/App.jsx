import { Auth } from './pages/auth';
import { Cotizador } from './pages/cotizador';
import { Cotizaciones } from './pages/cotizaciones';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PDF } from './components/pdf/PDF';
import { PDFTr } from './components/pdf/PDFTr';

import './App.css';
import { UpdateCotizacion } from './pages/updateCotizacion';
import { OlvideContrasena } from './pages/olvide-contrasena';
import { RestablecerContrasena } from './pages/restablecer-contrasena';
import { PDFBacherey } from './components/pdf/PDF-bacherey';
import { PDFTrBacherey } from './components/pdf/PDFTr-bacherrey';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/autenticacion' exact element={<Auth />} />
          <Route
            path='/olvide-contrasena'
            exact
            element={<OlvideContrasena />}
          />
          <Route
            path='/restablecer-contrasena'
            exact
            element={<RestablecerContrasena />}
          />
          <Route path='/cotizador' exact element={<Cotizador />} />
          <Route path='/cotizaciones' exact element={<Cotizaciones />} />

          <Route path='/PDFTr' exact element={<PDFTr />} />
          <Route path='/pdf/:cotizacionId' exact element={<PDF />} />
          <Route path='/PDFTrBacherey' exact element={<PDFTrBacherey />} />
          <Route
            path='/pdf-bacherey/:cotizacionId'
            exact
            element={<PDFBacherey />}
          />

          <Route
            path='/cotizador-actualizar/:cotizacionId'
            exact
            element={<UpdateCotizacion />}
          />
          <Route path='*' exact element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
