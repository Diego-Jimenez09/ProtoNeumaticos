# Inspección general

Componente independiente en React y JavaScript. La demostración muestra únicamente el menú solicitado. No hay backend, almacenamiento automático, campos adicionales ni botón de guardar.

## Probar la demostración

Requiere Node.js 20.19+ o 22.12+.

```sh
npm install
npm run dev
```

Abre la dirección que muestra Vite. Las diez opciones se muestran en dos columnas y cinco filas, tanto en PC como en celular. En espacios estrechos, el icono y la casilla quedan encima del nombre para aprovechar el ancho. Cuando el componente dispone de al menos 46 rem, cada tarjeta usa una distribución horizontal más compacta. En pantallas pequeñas se puede desplazar la página normalmente.

Para comprobar una selección previa, abre `/?selected=engine_oil&selected=exterior_lights` en esa misma dirección. Es un recurso de la demostración; en tu aplicación la selección llega por `value`. La dirección normal `/` siempre comienza vacía. Los cambios realizados durante la demostración no se guardan al recargar.

```sh
npm run build
npm run preview
```

## Integrar en el formulario existente

Copia la carpeta `src/components/GeneralInspection` a tu aplicación. Importa el componente; su archivo CSS se importa automáticamente. No copies `demo.css`, que solo da formato a la página de demostración. Solo se requiere React; los iconos son SVG incluidos en el componente.

```jsx
import { useState } from 'react';
import {
  GeneralInspection,
  GENERAL_INSPECTION_OPTIONS,
} from './components/GeneralInspection';

function FormularioExistente({ registro }) {
  // Sin selección anterior: []. Con selección anterior: los mismos IDs guardados.
  const [inspeccion, setInspeccion] = useState(
    registro?.inspeccionGeneral ?? []
  );

  // Integra esto dentro del formulario que ya tienes.
  // Su guardado existente puede incluir: { inspeccionGeneral: inspeccion }.
  return (
    <GeneralInspection value={inspeccion} onChange={setInspeccion} />
  );
}
```

`value` es un array de IDs y, si se omite, equivale a `[]`. `onChange(nextIds)` recibe la selección completa después de cada cambio. El componente es controlado: el padre debe actualizar `value`. También refleja cambios de `value` posteriores a la primera carga, por ejemplo cuando llega un registro desde una API. No muta el array recibido; entrega IDs conocidos, únicos y en el orden de las opciones.

Para obtener también los nombres:

```js
const opcionesSeleccionadas = GENERAL_INSPECTION_OPTIONS.filter(
  opcion => inspeccion.includes(opcion.id)
);
// [{ id: 'engine_oil', label: 'Control de niveles y fugas', icon: 'oil' }, ...]
```

Si el formulario usa `FormData`, las casillas marcadas se envían con el nombre `generalInspection`:

```js
const ids = new FormData(formulario).getAll('generalInspection');
```

Puedes cambiar ese nombre con la prop `name`. Cada instancia usa identificadores HTML únicos mediante `useId`, por lo que puede convivir con otros componentes o instancias.

## Identificadores estables

| ID | Opción |
| --- | --- |
| `engine_oil` | Control de niveles y fugas |
| `exterior_lights` | Luces exteriores |
| `ventilation_heating_ac` | Ventilación, calefacción y A/C |
| `dashboard_indicators` | Tablero e indicadores |
| `lubrication` | Engrase |
| `belts_rollers` | Correas y rodillos |
| `batteries_terminals` | Baterías y terminales |
| `tires_visual` | Neumáticos: revisión visual |
| `doors_hood_latches` | Puertas, capó y cierres |
| `windshield_glass` | Parabrisas y demás cristales |

Guarda los IDs, no los textos. Una casilla marcada solo registra que se realizó la revisión o tarea. Una casilla sin marcar no registra realización ni expresa una falla. Ninguna opción es obligatoria.

Los IDs `engine_oil` y `lubrication` se conservan aunque sus nombres visibles se hayan actualizado, para que las selecciones anteriores sigan funcionando.

## Accesibilidad y estilos

- Casillas HTML nativas dentro de etiquetas pulsables, agrupadas por un `fieldset` con `legend` e instrucciones asociadas.
- Tab y Mayús+Tab recorren las opciones; Espacio marca o desmarca. El foco tiene un contorno visible.
- El lector de pantalla obtiene el nombre completo y el estado de cada casilla. Los iconos decorativos no duplican el nombre accesible.
- El estado marcado combina check, borde y fondo azul, sin añadir texto. Incluye soporte para colores forzados.
- Tarjetas de al menos 88 px de alto en PC y 128 px en la distribución compacta. Texto de 18 y 17 px respectivamente con la configuración habitual, ajuste de línea sin recortes y sin animaciones.
- Todas las reglas del componente están limitadas a `.ig-menu` y sus clases con prefijo. Las variables CSS también pertenecen al componente. No aplica reglas a `body`, `html`, `input` o `label` globalmente.
- La disposición interna de las tarjetas depende del ancho disponible del componente, no solo del dispositivo. Siempre se mantienen dos columnas, incluso sin soporte para consultas de contenedor.
