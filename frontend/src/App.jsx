import React, { useState, useEffect } from 'react';
import Auth from './Auth'; // Asegúrate de que Auth.jsx esté en la misma carpeta src/

export default function App() {
  // Estados de Autenticación y Perfil
  const [usuario, setUsuario] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Estados de la Interfaz
  const [activeTab, setActiveTab] = useState('vender');
  const [currency, setCurrency] = useState('PEN');
  const [amount, setAmount] = useState('340');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  // Precios Binance API
  const [prices, setPrices] = useState({
    BTCUSDT: 0,
    ETHUSDT: 0,
    BNBUSDT: 0,
    SOLUSDT: 0,
    XRPUSDT: 0,
    USDTBID: 3.75,
  });

  // Lista de Criptos en Tendencia
  const [trending, setTrending] = useState([
    { symbol: 'PEPE', name: 'Pepe', price: '0.0000095', change: '+12.4%', isUp: true },
    { symbol: 'DOGE', name: 'Dogecoin', price: '0.142', change: '+8.1%', isUp: true },
    { symbol: 'SHIB', name: 'Shiba Inu', price: '0.000018', change: '-2.3%', isUp: false },
    { symbol: 'SUI', name: 'Sui', price: '1.95', change: '+15.8%', isUp: true },
  ]);

  const [loading, setLoading] = useState(true);

  // 1. Cargar Sesión Persistente del usuario al iniciar
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('usuario');
    if (sesionGuardada) {
      try {
        const data = JSON.parse(sesionGuardada);
        const emailExtraido = data.email || (data.user && data.user.email) || 'Usuario';
        setUsuario({ ...data, email: emailExtraido });
      } catch (e) {
        console.error('Error al restaurar sesión guardada:', e);
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  // 2. Precios en Vivo desde Binance API
  useEffect(() => {
    const fetchBinancePrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price');
        const data = await res.json();

        const btc = data.find((item) => item.symbol === 'BTCUSDT');
        const eth = data.find((item) => item.symbol === 'ETHUSDT');
        const bnb = data.find((item) => item.symbol === 'BNBUSDT');
        const sol = data.find((item) => item.symbol === 'SOLUSDT');
        const xrp = data.find((item) => item.symbol === 'XRPUSDT');

        setPrices((prev) => ({
          ...prev,
          BTCUSDT: btc ? parseFloat(btc.price) : 0,
          ETHUSDT: eth ? parseFloat(eth.price) : 0,
          BNBUSDT: bnb ? parseFloat(bnb.price) : 0,
          SOLUSDT: sol ? parseFloat(sol.price) : 0,
          XRPUSDT: xrp ? parseFloat(xrp.price) : 0,
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error al conectar con Binance API:', error);
      }
    };

    fetchBinancePrices();
    const interval = setInterval(fetchBinancePrices, 5000);
    return () => clearInterval(interval);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setShowProfileModal(false);
  };

  // Cálculos dinámicos
  const factorMoneda = currency === 'PEN' ? prices.USDTBID : 1;
  const btcPrecioBase = prices.BTCUSDT * factorMoneda;
  const ethPrecioBase = prices.ETHUSDT * factorMoneda;
  const bnbPrecioBase = prices.BNBUSDT * factorMoneda;
  const solPrecioBase = prices.SOLUSDT * factorMoneda;
  const xrpPrecioBase = prices.XRPUSDT * factorMoneda;
  const usdtPrecioBase = 1 * factorMoneda;

  // Lista ampliada de Criptomonedas para la tabla principal
  const cryptoList = [
    { name: 'Bitcoin', symbol: 'BTC', basePrice: btcPrecioBase },
    { name: 'Ethereum', symbol: 'ETH', basePrice: ethPrecioBase },
    { name: 'Binance Coin', symbol: 'BNB', basePrice: bnbPrecioBase },
    { name: 'Solana', symbol: 'SOL', basePrice: solPrecioBase },
    { name: 'Ripple', symbol: 'XRP', basePrice: xrpPrecioBase },
    { name: 'Tether', symbol: 'USDT', basePrice: usdtPrecioBase },
  ];

  return (
    <div style={styles.container}>
      {/* 1. Navbar */}
      <header style={styles.navbar}>
        <div style={styles.logoSection}>
          {/* Logo cargado desde /public/logo.jpeg */}
          <div style={styles.logoBox}>
            <img 
              src="/logo.jpeg" 
              alt="López Cripto Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <span style={styles.brandTitle}>LÓPEZ CRIPTO</span>
          <div style={styles.navPills}>
            <button 
              style={activeTab === 'comprar' ? styles.pillActiveRed : styles.pillInactive}
              onClick={() => setActiveTab('comprar')}
            >
              COMPRA
            </button>
            <button 
              style={activeTab === 'vender' ? styles.pillActiveRed : styles.pillInactive}
              onClick={() => setActiveTab('vender')}
            >
              VENDE
            </button>
            <button 
              style={activeTab === 'invertir' ? styles.pillActiveRed : styles.pillInactive}
              onClick={() => setActiveTab('invertir')}
            >
              INVIERTE
            </button>
          </div>
        </div>

        <div style={styles.rightHeader}>
          <div style={styles.currencySelector}>
            <label style={{ fontSize: '12px', color: '#aaa', marginRight: '6px' }}>Moneda:</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={styles.selectInput}
            >
              <option value="PEN">PEN (S/)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div style={styles.binanceTag}>
            <span style={{ color: '#f0b90b', marginRight: '5px' }}>◆</span> Binance Live
          </div>

          {/* Botón de Perfil Clicable / Login */}
          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setShowProfileModal(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid #222736',
                  color: '#f0b90b',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  transition: '0.2s'
                }}
              >
                👤 {usuario?.email || 'Mi Cuenta'}
              </button>

              <button style={styles.logoutBtn} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button 
              style={styles.loginBtnHeader} 
              onClick={() => setShowAuthModal(true)}
            >
              🔑 Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      {/* 2. Billetera y Saldos */}
      <section style={styles.walletCard}>
        <div style={styles.walletHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>💼</span>
            <h2 style={styles.walletTitle}>
              {usuario?.email ? `Billetera de ${usuario.email.split('@')[0]}` : 'Mis Saldos / Billetera'}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Balance Total Estimado:</span>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#00e676' }}>
              {currency === 'PEN' ? 'S/' : '$'} 17,615.66
            </div>
          </div>
        </div>

        <div style={styles.balancesGrid}>
          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>PE Soles (PEN)</span>
            <span style={styles.cryptoValue}>S/ 1,500.00</span>
          </div>
          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>US Dólares (USD)</span>
            <span style={styles.cryptoValue}>$ 500.00</span>
          </div>
          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>Bitcoin</span>
            <span style={styles.cryptoValue}>0.025 <small style={{ color: '#ff9800' }}>BTC</small></span>
          </div>
          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>Ethereum</span>
            <span style={styles.cryptoValue}>0.15 <small style={{ color: '#aaa' }}>ETH</small></span>
          </div>
          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>Binance Coin</span>
            <span style={styles.cryptoValue}>1.2 <small style={{ color: '#f0b90b' }}>BNB</small></span>
          </div>
          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>Tether</span>
            <span style={styles.cryptoValue}>250 <small style={{ color: '#00e676' }}>USDT</small></span>
          </div>
        </div>
      </section>

      {/* 3. Cotizaciones, Calculadora y Sección Lateral en Tendencia */}
      <div style={styles.mainGrid3Cols}>
        {/* Columna 1: Tabla de Cotizaciones */}
        <div style={styles.quotesCard}>
          <h3 style={styles.cardHeaderTitle}>
            Cotizaciones Binance en Vivo ({currency}) {loading && '🔄 Cargando...'}
          </h3>
          <table style={styles.table}>
            <thead>
              <tr style={{ color: '#777', fontSize: '13px', textAlign: 'left' }}>
                <th style={{ paddingBottom: '12px' }}>Activo</th>
                <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Compra (+3.1%)</th>
                <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Venta (-3.1%)</th>
              </tr>
            </thead>
            <tbody>
              {cryptoList.map((coin) => (
                <tr key={coin.symbol} style={styles.tableRow}>
                  <td>
                    <strong>{coin.name}</strong> <small style={{ color: '#777' }}>({coin.symbol})</small>
                  </td>
                  <td style={{ textAlign: 'right', color: '#00e676', fontWeight: 'bold' }}>
                    {currency === 'PEN' ? 'S/' : '$'}{' '}
                    {(coin.basePrice * 1.031).toLocaleString('en-US', {
                      minimumFractionDigits: coin.symbol === 'XRP' || coin.symbol === 'USDT' ? 4 : 2,
                      maximumFractionDigits: coin.symbol === 'XRP' || coin.symbol === 'USDT' ? 4 : 2,
                    })}
                  </td>
                  <td style={{ textAlign: 'right', color: '#ff5252', fontWeight: 'bold' }}>
                    {currency === 'PEN' ? 'S/' : '$'}{' '}
                    {(coin.basePrice * 0.969).toLocaleString('en-US', {
                      minimumFractionDigits: coin.symbol === 'XRP' || coin.symbol === 'USDT' ? 4 : 2,
                      maximumFractionDigits: coin.symbol === 'XRP' || coin.symbol === 'USDT' ? 4 : 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Columna 2: Calculadora */}
        <div style={styles.actionCard}>
          <h3 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '18px', color: '#f0b90b' }}>
            Calculadora de Conversión
          </h3>
          
          <div style={{ marginTop: '15px' }}>
            <label style={styles.fieldLabel}>Monto a Operar ({currency}):</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              style={styles.inputField} 
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={styles.fieldLabel}>Selecciona Criptomoneda:</label>
            <select 
              value={selectedCrypto} 
              onChange={(e) => setSelectedCrypto(e.target.value)}
              style={styles.inputField}
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="BNB">Binance Coin (BNB)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="XRP">Ripple (XRP)</option>
              <option value="USDT">Tether (USDT)</option>
            </select>
          </div>

          <div style={styles.calcResult}>
            <span>Recibirás aproximadamente:</span>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00e676', marginTop: '4px' }}>
              {(() => {
                const selectedCoin = cryptoList.find((c) => c.symbol === selectedCrypto);
                if (amount && selectedCoin && selectedCoin.basePrice > 0) {
                  return (amount / (selectedCoin.basePrice * 1.031)).toFixed(6) + ' ' + selectedCrypto;
                }
                return '0.00';
              })()}
            </div>
          </div>
        </div>

        {/* Columna 3: Criptos en Tendencia */}
        <div style={styles.trendingCard}>
          <h3 style={{ ...styles.cardHeaderTitle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            🔥 Criptos en Tendencia
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {trending.map((item) => (
              <div key={item.symbol} style={styles.trendingRow}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#777' }}>{item.symbol}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>${item.price}</div>
                  <div style={{ fontSize: '11px', color: item.isUp ? '#00e676' : '#ff5252', fontWeight: 'bold' }}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal 1: Autenticación */}
      {showAuthModal && (
        <Auth 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(datosUsuario) => setUsuario(datosUsuario)}
          styles={styles}
        />
      )}

      {/* Modal 2: Perfil de Usuario con ID dinámico de Django */}
      {showProfileModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, width: '420px' }}>
            <button style={styles.closeBtn} onClick={() => setShowProfileModal(false)}>✕</button>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>👤</div>
              <h3 style={{ color: '#f0b90b', margin: 0 }}>Perfil de Usuario</h3>
              <span style={{ fontSize: '12px', color: '#00e676', fontWeight: 'bold' }}>● Cuenta Verificada</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={styles.cryptoBox}>
                <span style={styles.cryptoLabel}>Correo Electrónico:</span>
                <span style={{ ...styles.cryptoValue, fontSize: '14px', color: '#fff' }}>
                  {usuario?.email || 'No disponible'}
                </span>
              </div>

              <div style={styles.cryptoBox}>
                <span style={styles.cryptoLabel}>ID de Cuenta:</span>
                <span style={{ ...styles.cryptoValue, fontSize: '14px', color: '#aaa' }}>
                  #USR-{usuario?.id || usuario?.user_id || '1001'}
                </span>
              </div>

              <div style={styles.cryptoBox}>
                <span style={styles.cryptoLabel}>Estado de Seguridad:</span>
                <span style={{ ...styles.cryptoValue, fontSize: '14px', color: '#00e676' }}>
                  2FA Inactivo / Contraseña Activa
                </span>
              </div>
            </div>

            <button 
              style={{ ...styles.submitBtn, marginTop: '20px' }} 
              onClick={() => setShowProfileModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos globales
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0d14', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '15px 25px' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e232d', paddingBottom: '10px' },
  logoSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoBox: { width: '45px', height: '45px', border: '1px solid #f0b90b', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141824' },
  brandTitle: { fontSize: '20px', fontWeight: 'bold', color: '#f0b90b' },
  navPills: { display: 'flex', gap: '6px', marginLeft: '15px' },
  pillInactive: { background: '#141824', border: '1px solid #2a2e3d', color: '#aaa', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer' },
  pillActiveRed: { background: '#ff5252', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  rightHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
  currencySelector: { display: 'flex', alignItems: 'center' },
  selectInput: { background: '#141824', border: '1px solid #f0b90b', color: '#f0b90b', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
  binanceTag: { border: '1px solid #333', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#f0b90b', background: '#111520' },
  loginBtnHeader: { background: 'linear-gradient(90deg, #f0b90b, #d4a007)', border: 'none', color: '#000', fontWeight: 'bold', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  logoutBtn: { background: '#2a2e3d', border: '1px solid #333', color: '#ff5252', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' },
  walletCard: { background: '#111520', border: '1px solid #f0b90b', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
  walletHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  walletTitle: { margin: 0, color: '#f0b90b', fontSize: '18px' },
  balancesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' },
  cryptoBox: { background: '#090b10', border: '1px solid #222736', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column' },
  cryptoLabel: { fontSize: '11px', color: '#aaa', marginBottom: '6px' },
  cryptoValue: { fontSize: '15px', fontWeight: 'bold' },
  mainGrid3Cols: { display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '15px' },
  quotesCard: { background: '#111520', border: '1px solid #222736', borderRadius: '10px', padding: '20px' },
  cardHeaderTitle: { color: '#f0b90b', margin: '0 0 20px 0', fontSize: '16px', textAlign: 'center' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableRow: { borderTop: '1px solid #1a1e2b', height: '40px' },
  actionCard: { background: '#111520', border: '1px solid #f0b90b', borderRadius: '10px', padding: '20px' },
  trendingCard: { background: '#111520', border: '1px solid #222736', borderRadius: '10px', padding: '20px' },
  trendingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#090b10', borderRadius: '6px', border: '1px solid #1a1e2b' },
  calcResult: { marginTop: '20px', padding: '12px', background: '#090b10', borderRadius: '6px', textAlign: 'center', border: '1px solid #222736' },
  fieldLabel: { display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' },
  inputField: { width: '100%', background: '#090b10', border: '1px solid #222736', color: '#fff', padding: '10px', borderRadius: '6px', boxSizing: 'border-box' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: '#111520', border: '1px solid #f0b90b', borderRadius: '12px', padding: '25px', width: '380px', position: 'relative' },
  closeBtn: { position: 'absolute', top: '12px', right: '15px', background: 'transparent', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer' },
  submitBtn: { width: '100%', background: '#f0b90b', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '10px' }
};