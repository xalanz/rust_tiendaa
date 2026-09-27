import { useState, type FormEvent } from "react";
import BarraSuperior from "../home/BarraSuperior.jsx";

export default function Registro() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const confirmation = form.elements.namedItem("password-confirm") as HTMLInputElement;
    if (password.value !== confirmation.value) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    setMessage("El registro todavía no está conectado a un servidor.");
  };

  return (
    <div className="home-page auth-page-layout">
      <BarraSuperior />
      <main className="register-page">
      <style>{`
        .register-page{--bg:#0b0a09;--panel:#141210;--panel2:#1b1815;--line:#2a2521;--cream:#f2ede2;--muted:#9a9187;--rust:#d9622b;--rust-light:#f08c4e;min-height:calc(100vh - 76px);display:grid;place-items:center;padding:32px 16px;background:radial-gradient(1200px 600px at 20% -10%,rgba(217,98,43,.08),transparent 60%),radial-gradient(900px 500px at 100% 100%,rgba(217,98,43,.05),transparent 60%),var(--bg);color:var(--cream);font-family:'Iowan Old Style',Georgia,'Times New Roman',serif}
        .register-wrap{width:min(100%,920px);display:grid;grid-template-columns:1.1fr 1fr;border:1px solid var(--line);background:var(--panel)}
        .register-side{position:relative;min-height:540px;display:flex;flex-direction:column;justify-content:space-between;padding:48px 40px;border-right:1px solid var(--line);background:linear-gradient(160deg,#17130f,#0e0c0a);overflow:hidden}
        .register-side:after{position:absolute;right:-120px;bottom:-120px;width:280px;height:280px;border:1px solid rgba(217,98,43,.35);content:'';transform:rotate(45deg)}
        .register-brand,.register-mobile-brand{width:fit-content;color:var(--cream);font-size:28px;font-weight:700;text-decoration:none}.register-brand span,.register-mobile-brand span{color:var(--rust)}
        .register-copy{position:relative;z-index:1}.register-copy h2{max-width:300px;margin:0 0 12px;font-size:34px;line-height:1.15}.register-copy p{max-width:280px;color:var(--muted);font-size:15px;font-style:italic;line-height:1.6}
        .register-form-side{display:flex;flex-direction:column;padding:44px 40px}.register-title{margin:0 0 28px;font-size:26px;line-height:1.2;text-shadow:none}
        .register-mobile-brand{display:none;margin-bottom:28px}.register-form{display:flex;flex-direction:column;gap:16px}.register-field label{display:block;margin-bottom:6px;color:var(--muted);font-size:13px}
        .register-field input{width:100%;border:1px solid var(--line);border-radius:0;outline:none;background:var(--panel2);color:var(--cream);padding:11px 12px;font-family:Arial,sans-serif;font-size:14px}.register-field input:focus{border-color:var(--rust)}
        .register-submit{width:100%;margin-top:8px;border:1px solid var(--rust);border-radius:0;background:var(--rust);color:#100c09;padding:13px;font:700 14px Arial,sans-serif;cursor:pointer}.register-submit:hover{background:var(--rust-light)}
        .register-message{color:var(--rust-light);font:12.5px/1.5 Arial,sans-serif}.register-foot{margin:auto 0 0;padding-top:24px;color:var(--muted);font:13px Arial,sans-serif;text-align:center}.register-foot a{color:var(--rust-light);text-decoration:none}
        .register-page button:focus-visible,.register-page a:focus-visible{outline:2px solid var(--rust-light);outline-offset:3px}
        @media(max-width:700px){.register-page{min-height:calc(100vh - 68px)}}
        @media(max-width:760px){.register-wrap{grid-template-columns:1fr;max-width:480px}.register-side{display:none}.register-form-side{padding:36px 28px}.register-mobile-brand{display:inline-block}}
        @media(max-width:360px){.register-form-side{padding:28px 20px}}
      `}</style>
      <section className="register-wrap" aria-labelledby="register-title">
        <aside className="register-side">
          <a className="register-brand" href="#inicio" aria-label="Óxido, inicio">ÓX<span>IDO</span></a>
          <div className="register-copy">
            <h2>Sumate al servidor.</h2>
            <p>Creá tu cuenta para guardar tus skins, tu inventario y tu progreso en ÓXIDO.</p>
          </div>
        </aside>
        <div className="register-form-side">
          <a className="register-mobile-brand" href="#inicio" aria-label="Óxido, inicio">ÓX<span>IDO</span></a>
          <h1 className="register-title" id="register-title">Crear cuenta</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="register-name">Nombre de usuario</label>
              <input id="register-name" name="username" type="text" autoComplete="username" required />
            </div>
            <div className="register-field">
              <label htmlFor="register-email">Correo electrónico</label>
              <input id="register-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="register-field">
              <label htmlFor="register-password">Contraseña</label>
              <input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
            </div>
            <div className="register-field">
              <label htmlFor="register-password-confirm">Confirmar contraseña</label>
              <input id="register-password-confirm" name="password-confirm" type="password" autoComplete="new-password" required />
            </div>
            {message && <p className="register-message" role="status">{message}</p>}
            <button type="submit" className="register-submit">Crear cuenta</button>
          </form>
          <p className="register-foot">¿Ya tenés cuenta? <a href="#/login">Iniciá sesión</a></p>
        </div>
      </section>
      </main>
    </div>
  );
}