# Grupo 10 Astro

Página en [Link](https://astro-59f6f.web.app/)

Para probar localmente entrar a la carpeta "astro". 
Correr `npm i`
Correr `npm run dev`

Importante mencionar que es necesario tener una versión actualizada de node para correr código. Se puede actualizar a la última versión mediante;
```
nvm install node
```

Se usó para éste caso la versión `v22.3.0`.

Se usa como fuente de datos la página `www.omdbapi.com`. Se permiten 1000 consultas diarias gratis.


## 🚀 Flujo del proyecto


El SSR se encuentra principalmente en la carga inicial de peliculas, donde se observa una muestra de las peliculas "star wars" para dar la sensación de carga que ofrecen las SSR. Ciertos componentes como los mensajes de bienvenida funcionan similar, pero todo el resto ocupa hidratación de las componentes por el lado del cliente. 

Hay que hacer login para escribir una reseña y valoración.

Nos hubiese gustado que la página "Selected Movies" funcionara en su totalidad como una SSR, pero al intentar hacerlo en astro con react, se caía al iterar sobre las peliculas, por lo que se decidió dejarlo como una componente react con hidratación.