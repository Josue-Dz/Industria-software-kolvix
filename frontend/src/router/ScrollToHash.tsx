import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Distancia máxima al borde superior para dar por bueno el desplazamiento.
// Con scroll-margin-top la sección queda a ~92px; se deja margen de sobra.
const TOLERANCIA_PX = 200;
const INTENTOS_MAXIMOS = 15;
const ESPERA_MS = 50;

//si la ruta trae hash lleva la vista a esa sección, y si no,
// vuelve al inicio en lugar de conservar el scroll de la pantalla anterior.
export const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Devuelve true cuando la sección quedó efectivamente a la vista.
    const alinearSeccion = () => {
      const destino = document.getElementById(hash.slice(1));
      if (!destino) {
        return false;
      }
      destino.scrollIntoView({ behavior: 'auto' });
      return Math.abs(destino.getBoundingClientRect().top) < TOLERANCIA_PX;
    };

    if (alinearSeccion()) {
      return;
    }

    let intentos = 0;
    const temporizador = setInterval(() => {
      if (alinearSeccion() || ++intentos >= INTENTOS_MAXIMOS) {
        clearInterval(temporizador);
      }
    }, ESPERA_MS);

    return () => clearInterval(temporizador);
  }, [pathname, hash]);

  return null;
};
