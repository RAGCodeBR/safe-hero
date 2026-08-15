"use client";

import { useMemo, useState } from "react";

type Account = { id: string; name: string; detail: string; initial: string; color: string; password: string; category: string };

const initialAccounts: Account[] = [
  { id: "instagram", name: "Instagram", detail: "arthur.silva", initial: "IG", color: "#f18bb4", password: "hero#2026", category: "Redes sociais" },
  { id: "google", name: "Google", detail: "arthur@gmail.com", initial: "G", color: "#79a7ff", password: "safe-access", category: "Trabalho" },
  { id: "netflix", name: "Netflix", detail: "Família", initial: "N", color: "#ff6f78", password: "stream123", category: "Entretenimento" },
  { id: "nubank", name: "Nubank", detail: "Conta pessoal", initial: "NU", color: "#a77af7", password: "bank-guard", category: "Finanças" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Início");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState(initialAccounts);
  const editingAccount = accounts.find((account) => account.id === editingId);
  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return accounts.filter((account) => `${account.name} ${account.detail} ${account.category}`.toLowerCase().includes(term));
  }, [accounts, query]);

  function addAccount(formData: FormData) {
    const name = String(formData.get("name") || "Novo acesso");
    const detail = String(formData.get("login") || "Login pessoal");
    const password = String(formData.get("password") || "nova-senha");
    setAccounts((current) => [{ id: `account-${Date.now()}`, name, detail, initial: name.slice(0, 2).toUpperCase(), color: "#72c6e8", password, category: "Pessoal" }, ...current]);
    setShowAdd(false);
  }

  function updateAccount(formData: FormData) {
    if (!editingId) return;
    const name = String(formData.get("name") || "Acesso");
    const detail = String(formData.get("login") || "Login pessoal");
    const password = String(formData.get("password") || "");
    setAccounts((current) => current.map((account) => account.id === editingId
      ? { ...account, name, detail, password, initial: name.slice(0, 2).toUpperCase() }
      : account));
    setVisible(null);
    setEditingId(null);
  }

  return (
    <main className="page-shell">
      <section className="phone-app" aria-label="Aplicativo Safe Hero">
        <header className="topbar">
          <div className="brand-mark" aria-hidden="true"><span>✓</span></div>
          <div className="brand-copy"><strong>Safe Hero</strong><small>Proteção que acompanha você</small></div>
          <button className="icon-button" aria-label="Abrir notificações"><span className="bell">●</span></button>
        </header>

        <div className="content">
          <div className="welcome">
            <div><p>Olá, Arthur!</p><h1>Seus acessos estão seguros.</h1></div>
            <div className="avatar">AS</div>
          </div>
          <article className="security-card">
            <div className="score-ring"><span>92</span><small>/100</small></div>
            <div className="security-copy"><p>NÍVEL DE PROTEÇÃO</p><h2>Excelente trabalho!</h2><span>Seu cofre está muito bem protegido.</span></div>
            <button aria-label="Ver relatório de segurança">›</button>
          </article>
          <div className="search-wrap">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar acessos" placeholder="Buscar senha ou aplicativo" />
            {query && <button onClick={() => setQuery("")} aria-label="Limpar busca">×</button>}
          </div>
          <div className="section-heading">
            <div><h2>Seus acessos</h2><p>{accounts.length} itens protegidos</p></div>
            <button onClick={() => setShowAdd(true)}>+ Novo acesso</button>
          </div>
          <div className="account-list" aria-live="polite">
            {filtered.map((account) => (
              <article className="account-row" key={account.id}>
                <div className="app-icon" style={{ background: account.color }}>{account.initial}</div>
                <div className="account-main"><strong>{account.name}</strong><span>{account.detail}</span></div>
                <div className="password-preview">{visible === account.name ? account.password : "••••••••"}</div>
                <div className="account-actions">
                  <button className="edit-button" onClick={() => setEditingId(account.id)} aria-label={`Editar acesso de ${account.name}`} title="Editar acesso"><span aria-hidden="true">&#9998;</span></button>
                  <button className="eye-button" onClick={() => setVisible(visible === account.name ? null : account.name)} aria-label={`${visible === account.name ? "Ocultar" : "Mostrar"} senha de ${account.name}`}>{visible === account.name ? "◉" : "◎"}</button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && <div className="empty-state"><span>⌕</span><strong>Nenhum acesso encontrado</strong><p>Tente buscar por outro nome.</p></div>}
          </div>
        </div>

        <nav className="bottom-nav" aria-label="Navegação principal">
          {[['⌂', 'Início'], ['▦', 'Cofre'], ['+', 'Adicionar'], ['⚙', 'Ajustes']].map(([icon, label]) => (
            <button key={label} className={`${activeTab === label ? "active" : ""} ${label === "Adicionar" ? "add-nav" : ""}`} onClick={() => label === "Adicionar" ? setShowAdd(true) : setActiveTab(label)}><span>{icon}</span><small>{label}</small></button>
          ))}
        </nav>

        {showAdd && (
          <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowAdd(false)}>
            <form className="add-sheet" onSubmit={(event) => { event.preventDefault(); addAccount(new FormData(event.currentTarget)); }} onMouseDown={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title"><div><p>NOVO ACESSO</p><h2>Proteja uma nova conta</h2></div><button type="button" onClick={() => setShowAdd(false)} aria-label="Fechar">×</button></div>
              <label>Aplicativo<input name="name" placeholder="Ex.: Spotify" required autoFocus /></label>
              <label>Usuário ou e-mail<input name="login" placeholder="voce@exemplo.com" required /></label>
              <label>Senha<input name="password" type="password" placeholder="Digite uma senha segura" required /></label>
              <button className="save-button" type="submit">Salvar no cofre</button>
            </form>
          </div>
        )}

        {editingAccount && (
          <div className="modal-backdrop" role="presentation" onMouseDown={() => setEditingId(null)}>
            <form className="add-sheet" onSubmit={(event) => { event.preventDefault(); updateAccount(new FormData(event.currentTarget)); }} onMouseDown={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title"><div><p>EDITAR ACESSO</p><h2>Atualize sua conta</h2></div><button type="button" onClick={() => setEditingId(null)} aria-label="Fechar">×</button></div>
              <label>Aplicativo<input name="name" defaultValue={editingAccount.name} required autoFocus /></label>
              <label>Usuário ou e-mail<input name="login" defaultValue={editingAccount.detail} required /></label>
              <label>Senha<input name="password" type="text" defaultValue={editingAccount.password} required /></label>
              <button className="save-button" type="submit">Salvar alterações</button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
