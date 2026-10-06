# López Cripto 🚀

Plataforma web interactiva para la consulta de cotizaciones de criptomonedas en tiempo real, calculadora de conversión de divisas, gestión de billetera simulada y sistema de autenticación dual (Django REST Framework + Google OAuth2).

---

## 🛠️ Tecnologías utilizadas

* **Frontend:** React + Vite, @react-oauth/google
* **Estilos:** Custom CSS (Diseño Neomórfico, Dark Mode y responsive layout)
* **Backend:** Django REST Framework (DRF)
* **Autenticación:** JWT, Django Auth & Google OAuth2
* **APIs externas:** Binance API (Precios en vivo)
* **Despliegue / Entorno:** Docker & Docker Compose

---

## ✨ Características principales

- 📊 **Cotizaciones Binance en Vivo:** Precios actualizados en tiempo real para BTC, ETH, BNB, SOL, XRP y USDT con tasas dinámicas en Soles (PEN) y Dólares (USD).
- 🔐 **Autenticación Dual:** 
  - Login y registro tradicional con email y contraseña en Django DRF.
  - Inicio de sesión rápido e integrado con **Google OAuth2**.
- 👤 **Perfil de Usuario Persistente:** Modal con visualización dinámica de la cuenta, ID asignado en Django (`#USR-ID`) y estado de verificación.
- 🔥 **Criptos en Tendencia:** Sección lateral interactiva con el rendimiento de los tokens más populares del mercado (PEPE, DOGE, SHIB, SUI).
- 💼 **Billetera Virtual:** Gestión de saldos simulados multitabla en PEN, USD y criptomonedas.
- 🧮 **Calculadora Cripto:** Simulación de compra/venta con cálculo de comisiones estimado en tiempo real.
- 🎨 **Branding Personalizado:** Interfaz con logo corporativo oficial servido desde la estructura pública de Vite.

---

## 🚀 Instrucciones de ejecución

### 1. Clonar el repositorio
```bash
git clone [https://github.com/DEIVILOPEZ/lopez-cripto_login.git](https://github.com/DEIVILOPEZ/lopez-cripto_login.git)
cd lopez-cripto_login
