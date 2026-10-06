import React, { useState, useEffect } from 'react';

export default function Auth({ onClose, onLoginSuccess, styles }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Cargar el script de Google al abrir el modal
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleGoogleResponse = async (response) => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/google-login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: response.credential }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('usuario', JSON.stringify(data));
          onLoginSuccess(data);
          onClose();
        } else {
          setErrorMsg(data.error || 'Error al validar con Google');
        }
      } catch (err) {
        // Modo prueba local sin backend
        const dummyUser = { email: 'usuario.google@gmail.com', id: 99 };
        localStorage.setItem('usuario', JSON.stringify(dummyUser));
        onLoginSuccess(dummyUser);
        onClose();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('usuario', JSON.stringify(data));
        onLoginSuccess(data);
        onClose();
      } else {
        setErrorMsg(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setErrorMsg('Error de conexión con el backend');
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        <h3 style={{ textAlign: 'center', color: '#f0b90b', marginBottom: '15px' }}>Acceso a López Cripto</h3>

        {errorMsg && <div style={{ color: '#ff5252', fontSize: '13px', textAlign: 'center', marginBottom: '10px' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={styles.fieldLabel}>Correo:</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={styles.inputField} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={styles.fieldLabel}>Contraseña:</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={styles.inputField} />
          </div>
          <button type="submit" style={styles.submitBtn}>Ingresar</button>
        </form>

        <div style={{ textAlign: 'center', margin: '15px 0', color: '#666', fontSize: '12px' }}>O CONTINÚA CON</div>

        {/* Botón Google Integrado sin librerías npm */}
        <div 
          id="g_id_onload"
          data-client_id="888888888888-dummyid.apps.googleusercontent.com"
          data-callback="handleGoogleResponse"
          data-auto_prompt="false">
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            className="g_id_signin" 
            data-type="standard" 
            data-size="large" 
            data-theme="filled_black" 
            data-text="sign_in_with" 
            data-shape="rectangular" 
            data-logo_alignment="left">
          </div>
        </div>
      </div>
    </div>
  );
}