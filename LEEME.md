# Rumbo · Plan de carrera

App web instalable (PWA) con:

- **Plan caminar-trotar de 12 semanas** con avisos por voz, pitidos y vibración, y la pantalla siempre encendida.
- **Datos del Galaxy Watch 5 Pro** vía Strava: mapa, distancia, ritmo, pulso, calorías, pasos (aprox.) y parciales por km.
- **Control de Spotify**: anterior, play/pausa y siguiente, también durante la sesión.
- **Fuerza sin gimnasio**: plan de 12 semanas en 3 niveles, en modo **Casa** (silla, pared, piso, mochila con botellas) o **Plaza** (bancos y barras bajas), guiado por voz y sin saltos.
- **Comida**: menú semanal barato para dos (desayuno, almuerzo, merienda y cena), guía del plato, reglas claras y lista de compras con tildes.
- **Progreso**: sesiones de trote y fuerza, km por semana y registro de peso.

## 1. Publicar en Netlify

La conexión con Strava usa una **función de servidor** (`netlify/functions/oauth.mjs`), que guarda el secreto de Strava.
Arrastrar la carpeta en Netlify Drop puede no publicar la función. Conviene usar una de estas opciones:

- **Netlify CLI**: desde la carpeta descomprimida, `npx netlify-cli deploy --prod`.
- **Git**: subí la carpeta a un repo y conectalo en Netlify. El `netlify.toml` ya está configurado.

Para confirmar que la función se publicó, abrí `https://TU-SITIO.netlify.app/.netlify/functions/oauth`.
Tiene que devolver un JSON.

## 2. Crear la app de Strava

1. Entrá a https://www.strava.com/settings/api y creá una aplicación.
2. En **Authorization Callback Domain** poné tu dominio, por ejemplo `rumbo-franco.netlify.app`, sin https ni barra.
3. Copiá el **Client ID** y el **Client Secret**.

## 3. Crear la app de Spotify (opcional)

1. Entrá a https://developer.spotify.com/dashboard → Create app.
2. En **Redirect URI** poné la URL exacta del sitio con la barra final, por ejemplo `https://rumbo-franco.netlify.app/`.
3. Marcá **Web API**.
4. Copiá el **Client ID**. Spotify no necesita secreto, porque usa PKCE.
5. En **User Management**, agregá tu propio mail de Spotify (la app arranca en modo desarrollo).
6. Para pausar o pasar temas, Spotify exige cuenta **Premium**.

## 4. Variables de entorno en Netlify

En Site configuration → Environment variables, cargá estas tres:

| Variable | Valor |
|---|---|
| `STRAVA_CLIENT_ID` | Client ID de Strava |
| `STRAVA_CLIENT_SECRET` | Client Secret de Strava |
| `SPOTIFY_CLIENT_ID` | Client ID de Spotify |

Después de cargarlas, volvé a desplegar el sitio.

## 5. Conectar el reloj

1. En **Samsung Health** (celular) → Ajustes → Servicios conectados → **Strava** → conectar.
2. En Rumbo → Ajustes (engranaje arriba a la derecha) → Conectar Strava (y Spotify).
3. Para instalar la app en el celu, abrí el sitio en Chrome → menú ⋮ → **Instalar app**.

## Cómo se usa en cada salida

1. En el reloj: **Ejercicio → Correr** (o Caminar).
2. En Rumbo: **Empezar sesión**. Te avisa cuándo trotar y cuándo caminar.
3. Al terminar, guardá el ejercicio en el reloj.
4. Cuando Samsung Health sincronice con Strava, la corrida aparece en **Corridas** con mapa, pulso y demás datos.

## Semana sugerida

Lunes, miércoles y viernes: trote. Martes, jueves y sábado: fuerza. Domingo: caminata tranquila o descanso.

## Notas

- El plan y el peso se guardan solo en ese teléfono. Desde Ajustes podés exportar un respaldo.
- Si el celular bloquea la pantalla, el navegador puede frenar los avisos de voz. La app pide mantener la pantalla encendida durante la sesión.
- Los pasos se calculan a partir de la cadencia promedio que registra el reloj.
