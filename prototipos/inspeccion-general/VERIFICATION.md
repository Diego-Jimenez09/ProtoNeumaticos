# Verificación del prototipo

Comprobaciones realizadas el 7 de septiembre de 2026 en la demostración ejecutada con Vite, mediante el navegador integrado.

| Comprobación | Resultado |
| --- | --- |
| Apertura normal | Diez casillas sin marcar; ninguna obligatoria. |
| Pulsar cada tarjeta y volver a pulsarla | Las diez opciones se marcan y desmarcan correctamente. |
| Independencia | Cambiar una opción conserva las demás selecciones. |
| Selección previa con nombres actualizados | `?selected=engine_oil&selected=lubrication` marca «Control de niveles y fugas» y «Engrase». |
| Selección previa más un cambio | Se puede desmarcar la primera opción con Espacio conservando «Engrase». |
| Texto al seleccionar | Marcar cualquiera de las diez opciones no modifica el texto visible ni añade «Realizado». |
| Teclado | Tab lleva a la siguiente opción; Espacio marca y desmarca; contorno de foco visible. |
| Semántica accesible | El árbol de accesibilidad contiene las diez casillas con sus nombres completos y estados correctos. |
| Escritorio, 1280 × 900 | Dos columnas y cinco filas de 88 px; diez tarjetas expuestas, sin desbordamiento horizontal. |
| Celular, 390 × 844 | Dos columnas y cinco filas de 128 px. |
| Celular, 320 × 740 | Dos columnas y cinco filas de entre 128 y 138 px, etiquetas completas, sin recorte de texto ni desbordamiento horizontal. Se comprobó que cada línea queda dentro de su tarjeta. |
| Regreso a la dirección normal | Selección vacía; no se conserva información de pruebas. |
| Compilación de producción | `npm run build` completado correctamente. |

Se revisaron capturas de escritorio y celular y las medidas de las diez etiquetas. La revisión de accesibilidad se hizo mediante semántica HTML, árbol accesible y teclado; no se realizó una sesión con NVDA o VoiceOver ni una prueba de campo con mecánicos.
