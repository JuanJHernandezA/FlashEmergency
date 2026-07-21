# FlashEmergency

**Tu asistente de emergencia de bolsillo — ubicación, guía y ayuda en segundos.**

---

## 🌐 Demo en Vivo

👉 **[https://tu-url-de-deployment.vercel.app](https://tu-url-de-deployment.vercel.app)**

---

## El Problema

Cuando ocurre una emergencia, el pánico se apodera de todo. La gente olvida cosas básicas: dónde está el hospital más cercano, cuál es el número de emergencia local, cómo describir su ubicación, qué hacer mientras llega la ayuda.

Cada segundo perdido buscando información es un segundo que importa.

## La Solución

FlashEmergency pone todas las herramientas de emergencia críticas en un solo lugar. Detecta tu país, muestra el número de emergencia correcto, encuentra hospitales cercanos y te da instrucciones de primeros auxilios guiadas por IA — todo sin registro, pago ni configuración.

Abre la app. Obtén ayuda. Así de simple.

---

## ¿Por qué FlashEmergency?

- **Cero configuración.** GPS, país, idioma, números de emergencia — todo detectado automáticamente.
- **Funciona en cualquier lugar.** Se adapta al sistema de emergencias de tu país (Colombia usa 123, España usa 112, Estados Unidos usa 911).
- **Funciona sin internet.** Contactos de emergencia, perfil médico, guías de primeros auxilios y tu última ubicación conocida siempre disponibles.
- **Accesible.** Botones grandes, control por voz, lectura en voz alta, modo oscuro, tamaños de fuente ajustables. Diseñado para situaciones de alto estrés.
- **Privado.** Todo se almacena localmente en tu dispositivo. Sin cuentas. Sin rastreo. Sin servidores.

---

## Funcionalidades

### Respuesta de Emergencia
- **Modo SOS de Emergencia** — Interfaz de pantalla completa con llamada de un toque, compartir ubicación y servicios cercanos.
- **Activación por Voz** — Di "Help me", "Ayuda" o "Emergency" para activar el SOS sin tocar el teléfono.
- **Números de Emergencia** — Detecta automáticamente tu país y muestra el número de emergencia local correcto.

### Ubicación y Navegación
- **Detección GPS** — Ubicación automática con identificación de ciudad, departamento/estado y país.
- **Mapa Interactivo** — Leaflet/OpenStreetMap mostrando hospitales, clínicas, farmacias, policía y bomberos cercanos.
- **Cómo Llegar** — Abre navegación GPS usando tus coordenadas exactas (nunca direcciones de texto).
- **Formato de Distancia** — Kilómetros o millas según tu país.
- **Fallback Offline del Mapa** — Sin internet, muestra servicios en caché y coordenadas en lugar de un mapa vacío.

### Asistente de IA para Emergencias
- **Flujo Guiado** — Selecciona entre 8 categorías de emergencia (infarto, asfixia, quemaduras, fracturas, envenenamiento, etc.) o describe tu situación.
- **Triaje Contextual** — La IA hace preguntas de seguimiento antes de dar orientación (¿La persona respira? ¿Hay sangrado?).
- **Consejo Consciente del País** — Recomienda llamar al número local correcto, no solo "911".
- **Bilingüe** — Responde en inglés o español según tu preferencia de idioma.
- **Conversaciones Persistentes** — Los mensajes se guardan en IndexedDB inmediatamente. Sales de la página, vuelves — tu conversación sigue ahí.

### Perfil Médico
- **Almacenamiento Local** — Nombre, edad, tipo de sangre, alergias, medicamentos, condiciones médicas, contacto de emergencia.
- **Integración con Modo Emergencia** — Información crítica mostrada durante la activación del SOS.
- **Tarjeta QR de Emergencia** — Genera un código QR con datos médicos esenciales. Muéstralo a los socorristas.

### Reportes de Emergencia
- **Documentación Fotográfica** — Captura o sube imágenes de lesiones, accidentes o escenas.
- **Geoetiquetado** — Incluye automáticamente coordenadas, nombre de ubicación y marca de tiempo.
- **Compartible** — Comparte vía Web Share API o copia al portapapeles.
- **Persistencia Local** — Almacenados en IndexedDB.

### Contactos y Compartir
- **Contactos de Emergencia** — Guarda personas de confianza con teléfono, nombre y relación.
- **Compartir Ubicación con un Toque** — Usa Web Share API con fallback al portapapeles.
- **Copiar Coordenadas** — Copia coordenadas GPS crudas instantáneamente.

### Accesibilidad y Preferencias
- **Tema Claro / Oscuro / Sistema** — Persistido en localStorage.
- **Control de Tamaño de Fuente** — Pequeño, Normal, Grande, Extra Grande.
- **Modo de Alto Contraste** — Para usuarios con baja visión.
- **Lectura al Pasar el Mouse** — Las secciones se leen en voz alta al pasar el cursor por 800ms.
- **Síntesis de Voz** — Las respuestas de IA e información de emergencia pueden leerse en voz alta.
- **Navegación por Teclado** — Gestión completa de foco y saltar al contenido.
- **UI Bilingüe** — Inglés y español con detección automática del navegador.

### PWA y Offline
- **Instalable** — Agregar a la pantalla de inicio en cualquier dispositivo.
- **Soporte Offline** — Contactos, perfil médico, tarjeta QR, guías de primeros auxilios, última ubicación conocida.
- **Service Worker** — Cachea recursos estáticos, fuentes, tiles del mapa y respuestas de API.
- **Indicadores de Estado del Dispositivo** — Muestra disponibilidad de GPS, internet, micrófono y síntesis de voz.

---

## APIs del Navegador

FlashEmergency está construido completamente sobre estándares web — no se necesita app nativa.

| API | Qué hace en la aplicación |
|-----|--------------------------|
| **Geolocation** | Obtiene tus coordenadas GPS para mostrar servicios cercanos y habilitar navegación. |
| **Web Share** | Comparte tu ubicación de emergencia vía la hoja de compartir nativa del teléfono. |
| **Clipboard** | Copia coordenadas o mensajes de emergencia cuando compartir no está disponible. |
| **Speech Recognition** | Escucha comandos de voz ("Help me", "Ayuda") para activar el modo emergencia. |
| **Speech Synthesis** | Lee respuestas de IA e información de emergencia en voz alta — útil cuando no puedes ver la pantalla. |
| **IndexedDB** | Almacena contactos, conversaciones, reportes y perfil médico local y persistentemente. |
| **Online/Offline Events** | Detecta cambios de conectividad y cambia a fallbacks offline automáticamente. |
| **File Input (Cámara)** | Captura fotos de emergencia para documentación y reportes. |
| **Service Worker** | Habilita funcionalidad offline y caché de recursos para la PWA. |
| **Vibration** | Retroalimentación háptica cuando se activa el SOS. |

---

## Servicios Externos

| Servicio | Propósito | Costo |
|----------|-----------|-------|
| **OpenStreetMap** | Tiles del mapa para el mapa interactivo del dashboard. | Gratis |
| **Overpass API** | Busca hospitales, farmacias, policía y bomberos cercanos por radio GPS. | Gratis |
| **Nominatim** | Geocodificación inversa — convierte coordenadas a ciudad/estado/país. | Gratis |
| **Groq** (Llama 3.3 70B) | Asistente de IA para emergencias — guía de primeros auxilios basada en texto. | Tier gratuito disponible |

No se requieren APIs de pago. Todo funciona con servicios de tier gratuito.

---

## Asistente de IA

El asistente de IA proporciona guía de emergencia **basada exclusivamente en texto**:

- Ofrece 8 categorías de emergencia pre-construidas para acceso rápido.
- Hace preguntas contextuales de seguimiento (consciencia, respiración, sangrado).
- Proporciona instrucciones paso a paso numeradas.
- Incluye precauciones de seguridad y cosas que evitar.
- Usa el país detectado y recomienda el número de emergencia local correcto.
- Responde en el idioma del usuario (inglés o español).

**Importante:** La IA no diagnostica condiciones, no prescribe medicamentos ni reemplaza ayuda médica profesional. Siempre recomienda contactar servicios de emergencia.

El análisis de imágenes no está soportado con el proveedor de IA actual.

---

## Experiencia Offline

Cuando se pierde la conexión a internet, lo siguiente sigue siendo completamente funcional:

- Contactos de emergencia (ver y llamar)
- Perfil médico
- Tarjeta QR de emergencia
- Guías de primeros auxilios (asfixia, sangrado, quemaduras, RCP, fracturas)
- Últimas coordenadas GPS conocidas
- Servicios cercanos en caché con enlaces de navegación
- Conversaciones de IA anteriores (solo lectura)
- Reportes fotográficos (ver y crear)

El mapa cambia a un fallback offline mostrando datos en caché.

---

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | React 19 |
| Lenguaje | TypeScript (strict) |
| Build | Vite |
| Estilos | Tailwind CSS v4 |
| Routing | React Router DOM |
| Estado | TanStack Query |
| Formularios | React Hook Form + Zod |
| Mapas | Leaflet + React Leaflet |
| Animaciones | Framer Motion |
| Notificaciones | Sonner |
| Iconos | Lucide React |
| Almacenamiento | IndexedDB + localStorage |
| IA | Groq (compatible con OpenAI) |
| i18n | react-i18next |
| QR | qrcode |
| PWA | vite-plugin-pwa + Workbox |

---

## Estructura del Proyecto

```
src/
├── components/       Componentes UI (chat, emergencia, layout, mapa, ui)
├── constants/        Config de app, números de emergencia, traducciones, guías
├── contexts/         Detección de país, gestión de tema
├── hooks/            Geolocalización, voz, contactos, estado online, activación por voz
├── lib/              IndexedDB, configuración i18n
├── pages/            Todas las páginas de la aplicación
├── routes/           Configuración de React Router
├── services/         Groq AI, Overpass, Geocodificación
├── styles/           CSS global con variables de tema
├── types/            Interfaces TypeScript
└── utils/            Formateo de ubicación, utilidades de compartir
```

---

## Filosofía de Diseño

FlashEmergency está diseñado para **personas en crisis**:

- **Mobile-first.** La mayoría de emergencias ocurren con el teléfono en mano.
- **Tres toques o menos.** Cualquier acción crítica alcanzable en máximo 3 interacciones.
- **Alto contraste.** Rojo para peligro, azul para confianza. Modos claro y oscuro.
- **Carga cognitiva mínima.** Sin muros de texto. Iconos claros. Botones obvios.
- **Accesible por defecto.** Áreas de toque grandes (44px+), soporte para lectores de pantalla, control por voz.
- **Sin registro.** Sin fricción. Abre la app, obtén ayuda.

---

## Contexto del Proyecto

FlashEmergency nació de una frustración real: ver a alguien entrar en pánico durante una emergencia menor y darse cuenta de que todas las herramientas que necesitaba — compartir ubicación, números de emergencia, instrucciones de primeros auxilios — existían en su teléfono, pero dispersas entre diferentes apps y búsquedas de Google.

El objetivo fue simple: construir una sola cosa que funcione al instante, funcione sin internet, funcione en cualquier país, y no requiera que pienses cuando no puedes.

---

Construido con urgencia y cuidado.
