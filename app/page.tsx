"use client";

import { useMemo, useState } from "react";

type Account = {
  id: string;
  name: string;
  detail: string;
  initial: string;
  color: string;
  password: string;
  category: string;
  twoFactor: boolean;
  updatedAt: string;
};

const initialAccounts: Account[] = [
  { id: "instagram", name: "Instagram", detail: "arthur.silva", initial: "IG", color: "#f18bb4", password: "hero#2026", category: "Redes sociais", twoFactor: true, updatedAt: "2026-08-01" },
  { id: "google", name: "Google", detail: "arthur@gmail.com", initial: "G", color: "#79a7ff", password: "safe-access", category: "Trabalho", twoFactor: true, updatedAt: "2026-07-20" },
  { id: "netflix", name: "Netflix", detail: "Família", initial: "N", color: "#ff6f78", password: "stream123", category: "Entretenimento", twoFactor: false, updatedAt: "2026-03-01" },
  { id: "nubank", name: "Nubank", detail: "Conta pessoal", initial: "NU", color: "#a77af7", password: "bank-guard", category: "Finanças", twoFactor: true, updatedAt: "2026-08-10" },
];

const commonPasswords = new Set(["123456", "password", "qwerty", "senha", "senha123", "admin", "letmein"]);

function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  return Math.min(score, 100);
}

function buildSecurityReport(accounts: Account[]) {
  if (!accounts.length) return { score: 0, title: "Cofre vazio", message: "Adicione acessos para iniciar a análise.", strong: 0, reused: 0, common: 0, stale: 0, twoFactor: 0 };

  const strengths = accounts.map((account) => passwordStrength(account.password));
  const averageStrength = strengths.reduce((total, value) => total + value, 0) / accounts.length;
  const passwordCounts = accounts.reduce<Record<string, number>>((counts, account) => {
    counts[account.password] = (counts[account.password] || 0) + 1;
    return counts;
  }, {});
  const reused = accounts.filter((account) => passwordCounts[account.password] > 1).length;
  const common = accounts.filter((account) => commonPasswords.has(account.password.toLowerCase())).length;
  const twoFactor = accounts.filter((account) => account.twoFactor).length;
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  const stale = accounts.filter((account) => Date.now() - new Date(account.updatedAt).getTime() > ninetyDays).length;
  const strong = strengths.filter((value) => value >= 70).length;
  const freshness = (accounts.length - stale) / accounts.length;
  const twoFactorCoverage = twoFactor / accounts.length;
  const reusePenalty = reused ? Math.min(20, reused * 8) : 0;
  const commonPenalty = Math.min(20, common * 12);
  const score = Math.max(0, Math.min(100, Math.round(averageStrength * .6 + twoFactorCoverage * 20 + freshness * 10 + 10 - reusePenalty - commonPenalty)));

  if (score >= 85) return { score, title: "Excelente trabalho!", message: "Seu cofre está muito bem protegido.", strong, reused, common, stale, twoFactor };
  if (score >= 70) return { score, title: "Boa proteção", message: "Poucos ajustes deixarão seu cofre ainda melhor.", strong, reused, common, stale, twoFactor };
  if (score >= 50) return { score, title: "Proteção razoável", message: "Há melhorias importantes para fazer.", strong, reused, common, stale, twoFactor };
  return { score, title: "Atenção necessária", message: "Revise os pontos críticos do seu cofre.", strong, reused, common, stale, twoFactor };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Início");
  const [showAdd, setShowAdd] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState(initialAccounts);
  const editingAccount = accounts.find((account) => account.id === editingId);
  const security = useMemo(() => buildSecurityReport(accounts), [accounts]);
  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return accounts.filter((account) => `${account.name} ${account.detail} ${account.category}`.toLowerCase().includes(term));
  }, [accounts, query]);

  function addAccount(formData: FormData) {
    const name = String(formData.get("name") || "Novo acesso");
    const detail = String(formData.get("login") || "Login pessoal");
    const password = String(formData.get("password") || "nova-senha");
    const twoFactor = formData.get("twoFactor") === "on";
    setAccounts((current) => [{ id: `account-${Date.now()}`, name, detail, initial: name.slice(0, 2).toUpperCase(), color: "#72c6e8", password, category: "Pessoal", twoFactor, updatedAt: new Date().toISOString() }, ...current]);
    setShowAdd(false);
  }

  function updateAccount(formData: FormData) {
    if (!editingId) return;
    const name = String(formData.get("name") || "Acesso");
    const detail = String(formData.get("login") || "Login pessoal");
    const password = String(formData.get("password") || "");
    const twoFactor = formData.get("twoFactor") === "on";
    setAccounts((current) => current.map((account) => account.id === editingId
      ? { ...account, name, detail, password, twoFactor, updatedAt: new Date().toISOString(), initial: name.slice(0, 2).toUpperCase() }
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
            <div className="score-ring"><span>{security.score}</span><small>/100</small></div>
            <div className="security-copy"><p>NÍVEL DE PROTEÇÃO</p><h2>{security.title}</h2><span>{security.message}</span></div>
            <button onClick={() => setShowSecurity(true)} aria-label="Ver relatório de segurança">›</button>
          </article>
          <div className="search-wrap">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar acessos" placeholder="Buscar senha ou aplicativo" />
            {query && <button onClick={() => setQuery("")} aria-label="Limpar busca">×</button>}
          </div>
          <div className="section-heading"><div><h2>Seus acessos</h2><p>{accounts.length} itens protegidos</p></div></div>
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
          {[["⌂", "Início"], ["▦", "Cofre"], ["+", "Adicionar"], ["⚙", "Ajustes"]].map(([icon, label]) => (
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
              <label className="toggle-field"><input name="twoFactor" type="checkbox" /><span><strong>Autenticação em dois fatores</strong><small>Marque se esta conta usa 2FA.</small></span></label>
              <button className="save-button" type="submit">Salvar no cofre</button>
            </form>
          </div>
        )}

        {editingAccount && (
          <div className="modal-backdrop edit-backdrop" role="presentation" onMouseDown={() => setEditingId(null)}>
            <form className="add-sheet edit-sheet" onSubmit={(event) => { event.preventDefault(); updateAccount(new FormData(event.currentTarget)); }} onMouseDown={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title"><div><p>EDITAR ACESSO</p><h2>Atualize sua conta</h2></div><button type="button" onClick={() => setEditingId(null)} aria-label="Fechar">×</button></div>
              <label>Aplicativo<input name="name" defaultValue={editingAccount.name} required autoFocus /></label>
              <label>Usuário ou e-mail<input name="login" defaultValue={editingAccount.detail} required /></label>
              <label>Senha<input name="password" type="text" defaultValue={editingAccount.password} required /></label>
              <label className="toggle-field"><input name="twoFactor" type="checkbox" defaultChecked={editingAccount.twoFactor} /><span><strong>Autenticação em dois fatores</strong><small>Marque se esta conta usa 2FA.</small></span></label>
              <button className="save-button" type="submit">Salvar alterações</button>
            </form>
          </div>
        )}

        {showSecurity && (
          <div className="modal-backdrop edit-backdrop" role="presentation" onMouseDown={() => setShowSecurity(false)}>
            <section className="security-sheet" role="dialog" aria-modal="true" aria-labelledby="security-report-title" onMouseDown={(event) => event.stopPropagation()}>
              <div className="sheet-title"><div><p>RELATÓRIO DE SEGURANÇA</p><h2 id="security-report-title">Proteção do cofre</h2></div><button type="button" onClick={() => setShowSecurity(false)} aria-label="Fechar">×</button></div>
              <div className="report-score"><strong>{security.score}</strong><span>pontos de 100</span></div>
              <div className="report-list">
                <div className={security.strong === accounts.length ? "good" : "warn"}><span>Senhas fortes</span><strong>{security.strong}/{accounts.length}</strong></div>
                <div className={security.reused === 0 ? "good" : "warn"}><span>Senhas reutilizadas</span><strong>{security.reused}</strong></div>
                <div className={security.common === 0 ? "good" : "warn"}><span>Senhas comuns ou expostas</span><strong>{security.common}</strong></div>
                <div className={security.twoFactor === accounts.length ? "good" : "warn"}><span>Contas com 2FA</span><strong>{security.twoFactor}/{accounts.length}</strong></div>
                <div className={security.stale === 0 ? "good" : "warn"}><span>Senhas antigas</span><strong>{security.stale}</strong></div>
              </div>
              <p className="report-note">A análise é feita localmente. “Comuns ou expostas” identifica senhas presentes numa lista básica de senhas inseguras, sem consultar serviços externos.</p>
              <button className="save-button" type="button" onClick={() => setShowSecurity(false)}>Entendi</button>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
