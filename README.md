# Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.20.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Deploy in Github Pages

Command for deploy in github pages: 
ng deploy --repo=https://github.com/MelvinJG/fraternity-v2-client.git --name="MelvinJG" --base-href=/fraternity-v2-client/

Video: https://www.youtube.com/watch?v=47PxHZf4qYg

## Recomendation

Mejor opción para producción:

1. Frontend: Vercel o Netlify (gratis, mejor que GitHub Pages)
    - Deploy automático
    - Variables de entorno
    - Preview deployments
    - Analytics
    - Mejor CDN global

2. Backend: Render, Railway, o Fly.io (tienen planes gratis)

Pero para producción seria, considera Vercel (gratis) - mismo esfuerzo, mejores prestaciones.

### Alternativas GRATIS para tu backend:

1. Render (Recomendado)
    - Plan gratuito permanente
    - Node.js, Python, Go, etc.
    - PostgreSQL gratis incluido
    - Se duerme tras 15 min sin uso (tarda ~30s en despertar)
    - Deploy desde GitHub automático
2. Railway
    - $5 crédito mensual gratis
    - Más rápido que Render
    - PostgreSQL incluido
    - Buen para desarrollo
3. Fly.io
    - Tier gratuito generoso
    - Mejor performance
    - Más complejo de configurar
4. Vercel (si es Next.js o funciones serverless)
    - Gratis y rápido
    - Pero limitado a funciones serverless, no apps tradicionales

```
Frontend (Angular)  →  GitHub Pages / Vercel
        ↓
Backend (Node.js)   →  Render / Railway
        ↓
Database            →  PostgreSQL (incluido en Render/Railway)
```

### BACKEND & DATABASE

**Con MySQL, tus opciones gratuitas cambian un poco:**

## **Backend Node.js + MySQL gratis:**

### **1. Railway ($5 crédito/mes)**
- ✅ Node.js + MySQL incluido
- ✅ Deploy automático desde GitHub
- ⚠️ $5/mes alcanza para ~500 horas (suficiente si no es 24/7)
- Recomendado para desarrollo/testing

### **2. Render + PlanetScale**
- **Backend en Render** (gratis, se duerme)
- **MySQL en PlanetScale** (gratis hasta 5GB)
- ✅ PlanetScale es MySQL compatible
- ✅ Buena opción para producción ligera
- Configuración separada pero ambos gratis

### **3. Clever Cloud**
- ✅ Plan gratuito con MySQL pequeño (256MB)
- ✅ Todo en un lugar
- ⚠️ Recursos muy limitados

### **4. Aiven**
- ✅ MySQL gratis (1 CPU, 1GB RAM)
- ⚠️ Solo 30 días de prueba, luego limitaciones

## **🎯 Recomendación:**

**Opción 1 (Simple):** Railway
- Todo en un lugar
- Fácil configuración
- Suficiente para empezar

**Opción 2 (Mejor para producción):**
```
Frontend → Vercel (gratis)
Backend  → Render (gratis)
MySQL    → PlanetScale (gratis hasta 5GB)
```

¿Cuántos usuarios esperas tener? ¿Es para uso interno de la hermandad?

