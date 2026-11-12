# Express Care México

Proyecto web estático del demo. Requiere Node.js 20 o superior.

## Desarrollo

```sh
npm run dev
```

Abre [http://127.0.0.1:4173/](http://127.0.0.1:4173/) en el navegador. El servidor lee `src/` y sirve los cambios al recargar. `src/index.html` contiene la página, `src/styles.css` los estilos, `src/app.js` el comportamiento y `src/assets/` las imágenes.

## Compilación y vista de producción

```sh
npm run build
npm run preview
```

Ejecuta `preview` después de detener `dev` si ambos usan el puerto 4173. El comando de compilación genera la carpeta `dist/` con la página y todos sus recursos estáticos.

## Cloudflare Pages

Conecta el repositorio de GitHub y usa la carpeta del proyecto como raíz.

| Ajuste | Valor |
| --- | --- |
| Framework | None |
| Comando de compilación | `npm run build` |
| Carpeta de salida | `dist` |

## Sucursales

Las cinco direcciones verificadas están en los botones del bloque Sucursales en `src/index.html`. Contry es la ubicación inicial. El mapa se carga desde Google Maps al servir la página por HTTP o HTTPS en un navegador compatible y requiere conexión. Los enlaces de ubicación e indicaciones también están disponibles cuando el mapa integrado está bloqueado.

La promoción y los precios son datos de demostración. La página conserva la etiqueta `noindex` del demo.
