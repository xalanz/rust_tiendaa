import { useState, type FormEvent } from "react";
import BarraSuperior from "../home/BarraSuperior.jsx";

type LoginProps = {
  onMicrosoftLogin: () => void;
  busy: boolean;
};

export default function Login({ onMicrosoftLogin, busy }: LoginProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("El acceso con correo y contraseña todavía no está configurado. Podés continuar con Microsoft.");
  };

  return (
    <div className="home-page auth-page-layout">
      <BarraSuperior />
      <main className="login-page">
      <style>{`
        .login-page{--bg:#0b0a09;--panel:#141210;--panel2:#1b1815;--line:#2a2521;--cream:#f2ede2;--muted:#9a9187;--rust:#d9622b;--rust-light:#f08c4e;min-height:calc(100vh - 76px);display:grid;place-items:center;padding:32px 16px;background:radial-gradient(1200px 600px at 20% -10%,rgba(217,98,43,.08),transparent 60%),radial-gradient(900px 500px at 100% 100%,rgba(217,98,43,.05),transparent 60%),var(--bg);color:var(--cream);font-family:'Iowan Old Style',Georgia,'Times New Roman',serif}
        .login-wrap{width:min(100%,920px);display:grid;grid-template-columns:1.1fr 1fr;border:1px solid var(--line);background:var(--panel)}
        .login-side{position:relative;min-height:540px;display:flex;flex-direction:column;justify-content:space-between;padding:48px 40px;border-right:1px solid var(--line);background:linear-gradient(160deg,#17130f,#0e0c0a);overflow:hidden}
        .login-side:after{position:absolute;right:-120px;bottom:-120px;width:280px;height:280px;border:1px solid rgba(217,98,43,.35);content:'';transform:rotate(45deg)}
        .login-brand,.login-mobile-brand{width:fit-content;color:var(--cream);font-size:28px;font-weight:700;text-decoration:none}.login-brand span,.login-mobile-brand span{color:var(--rust)}
        .login-copy{position:relative;z-index:1}.login-copy h2{max-width:300px;margin:0 0 12px;font-size:34px;line-height:1.15}.login-copy p{max-width:280px;color:var(--muted);font-size:15px;font-style:italic;line-height:1.6}
        .login-form-side{display:flex;flex-direction:column;padding:44px 40px}.login-title{margin:0 0 28px;font-size:26px;line-height:1.2;text-shadow:none}
        .login-mobile-brand{display:none;margin-bottom:28px}.login-form{display:flex;flex-direction:column;gap:16px}.login-field label{display:block;margin-bottom:6px;color:var(--muted);font-size:13px}
        .login-field input{width:100%;border:1px solid var(--line);border-radius:0;outline:none;background:var(--panel2);color:var(--cream);padding:11px 12px;font-family:Arial,sans-serif;font-size:14px}.login-field input:focus{border-color:var(--rust)}
        .login-options{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;color:var(--muted);font:13px Arial,sans-serif}.login-check{display:inline-flex;align-items:center;gap:8px}.login-check input{accent-color:var(--rust)}
        .login-text-button{border:0;background:none;color:var(--rust-light);padding:0;font:inherit;cursor:pointer}.login-submit,.login-provider{width:100%;border:1px solid var(--line);border-radius:0;padding:13px;font:700 14px Arial,sans-serif;cursor:pointer}
        .login-submit{margin-top:8px;border-color:var(--rust);background:var(--rust);color:#100c09}.login-submit:hover{background:var(--rust-light)}.login-provider{background:var(--panel2);color:var(--cream)}.login-provider:hover:not(:disabled){border-color:var(--rust)}
        .login-divider{display:flex;align-items:center;gap:12px;margin:6px 0;color:var(--muted);font:12px Arial,sans-serif}.login-divider:before,.login-divider:after{height:1px;flex:1;background:var(--line);content:''}
        .login-message{color:var(--rust-light);font:12.5px/1.5 Arial,sans-serif}.login-foot{margin:auto 0 0;padding-top:24px;color:var(--muted);font:13px Arial,sans-serif;text-align:center}.login-foot a{color:var(--rust-light);text-decoration:none}
        .login-page button:focus-visible,.login-page a:focus-visible{outline:2px solid var(--rust-light);outline-offset:3px}
        @media(max-width:700px){.login-page{min-height:calc(100vh - 68px)}}
        @media(max-width:760px){.login-wrap{grid-template-columns:1fr;max-width:480px}.login-side{display:none}.login-form-side{padding:36px 28px}.login-mobile-brand{display:inline-block}}
        @media(max-width:360px){.login-form-side{padding:28px 20px}}
      `}</style>
      <section className="login-wrap" aria-labelledby="login-title">
        <aside className="login-side">
          <a className="login-brand" href="#inicio" aria-label="Óxido, inicio">ÓX<span>IDO</span></a>
          <div className="login-copy">
            <h2>El servidor no espera a nadie.</h2>
            <p>Guardá tu inventario, tus skins y tu progreso. Accedé cuando quieras seguir jugando.</p>
          </div>
        </aside>
        <div className="login-form-side">
          <a className="login-mobile-brand" href="#inicio" aria-label="Óxido, inicio">ÓX<span>IDO</span></a>
          <h1 className="login-title" id="login-title">Iniciar sesión</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Correo electrónico</label>
              <input id="login-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>
              <input id="login-password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <div className="login-options">
              <label className="login-check"><input type="checkbox" name="remember" /> Recordarme</label>
              <button type="button" className="login-text-button" onClick={() => setMessage("La recuperación de contraseña requiere un servidor de autenticación configurado.")}>¿Olvidaste tu contraseña?</button>
            </div>
            {message && <p className="login-message" role="status">{message}</p>}
            <button type="submit" className="login-submit">Entrar</button>
            <div className="login-divider">o continuá con</div>
            <button type="button" className="login-provider" onClick={onMicrosoftLogin} disabled={busy}>
              {busy ? "Conectando..." : "Continuar con Microsoft"}
            </button>
          </form>
          <p className="login-foot"><a href="#inicio">Volver al inicio</a></p>
        </div>
      </section>
      </main>
    </div>
  );
}