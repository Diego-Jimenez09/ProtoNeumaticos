# ProtoNeumaticos

## Prototipo de Inspección general

El menú de inspección está disponible como aplicación independiente en [prototipos/inspeccion-general](prototipos/inspeccion-general/README.md).

- [Ver la demostración publicada](https://inspeccion-general-taller.d-jimenez09.chatgpt.site/).
- [Componente reutilizable y estilos](prototipos/inspeccion-general/src/components/GeneralInspection).
- [Comprobaciones realizadas](prototipos/inspeccion-general/VERIFICATION.md).

Para ejecutarlo desde la raíz del repositorio (Node.js 20.19+ o 22.12+):

```sh
cd prototipos/inspeccion-general
npm ci
npm run dev
```

Para compilarlo, ejecuta `npm run build` desde esa misma carpeta. La aplicación original de neumáticos continúa en la raíz del repositorio y conserva sus comandos habituales.

El prototipo usa React, JavaScript y CSS, no tiene backend y ofrece diez opciones en dos columnas. El formulario principal recibe los IDs seleccionados mediante `onChange` y controla la selección con `value`. La guía de la carpeta incluye el ejemplo de integración.

La demostración publicada es independiente de GitHub: subir cambios a esta rama no actualiza automáticamente ese enlace.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
