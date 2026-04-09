# Recaudación Barkojba + 35

Sistema web de recaudación para el equipo de fútbol amateur Barkojba + 35.

## Características

- ✅ Tabla de jugadores y saldos
- ✅ Tesorero puede registrar pagos
- ✅ Cálculo automático de saldos
- ✅ Historial de pagos
- ✅ Interfaz móvil responsive
- ✅ Datos guardados en Supabase (PostgreSQL)

## Stack

- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel

## Instalación local (desarrollo)

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
npm start
```

La app estará disponible en `http://localhost:3000`

## Variables de entorno

El archivo `.env.local` incluye las credenciales de Supabase (ya configuradas).

No requiere cambios para usar en desarrollo.

## Deploy en Vercel

1. Push a GitHub (ver instrucciones abajo)
2. Conectar GitHub a Vercel
3. Deploy automático en cada push

## GitHub (Paso a Paso)

### 1. Crear repo en GitHub
```bash
git init
git add .
git commit -m "Initial commit: Barkojba recaudacion app"
git branch -M main
git remote add origin https://github.com/tu-usuario/barkojba-recaudacion.git
git push -u origin main
```

### 2. Conectar a Vercel
- Ir a https://vercel.com
- "New Project"
- Seleccionar el repo "barkojba-recaudacion"
- Vercel detecta Next.js automáticamente
- Click "Deploy"
- URL: `recaudacion.barcojba.vercel.app`

## Estructura de carpetas

```
.
├── app/
│   ├── app.jsx          (Componente principal)
│   ├── page.tsx         (Página de Next.js)
│   ├── layout.tsx       (Layout)
│   └── globals.css      (Estilos)
├── public/              (Assets estáticos)
├── package.json
├── tailwind.config.js
├── next.config.js
└── .env.local          (Credenciales - gitignored)
```

## Uso

### Para jugadores
1. Abren la URL: `recaudacion.barcojba.vercel.app`
2. Ven la tabla con todos los jugadores
3. Ven su saldo (cuánto deben o qué acreedor son)
4. Todo visible, sin login

### Para tesorero
1. Abre la URL
2. Marca checkbox "Soy tesorero"
3. Click "+ Registrar pago"
4. Llena: Jugador, Mes, Monto
5. Click "Guardar pago"
6. El saldo se actualiza automáticamente

## Base de Datos

Supabase PostgreSQL con 3 tablas:

- **players**: Lista de jugadores (id, name, cobrable)
- **payments**: Pagos registrados (id, player_id, month, amount, created_at)
- **team_config**: Configuración del equipo (team_name, cuota_fija, months)

## Contacto

Diego Mizraji - diegoreich@gmail.com
