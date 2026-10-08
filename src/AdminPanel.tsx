import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  LogOut,
  Mail,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { adminEmail, auth, db, firebaseConfigured } from "./firebase";
import { verificationErrorMessage } from "./authMessages";
import type { Order, OrderStatus } from "./orders";

const statusLabels: Record<OrderStatus, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function formatDate(order: Order) {
  const date = order.createdAt?.toDate?.();
  return date
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date)
    : "Agora";
}

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setVerified(Boolean(currentUser?.emailVerified));
    });
  }, []);

  useEffect(() => {
    if (!db || !user || user.email !== adminEmail || !verified) return;
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      ordersQuery,
      (snapshot) => {
        setOrders(
          snapshot.docs.map(
            (entry) => ({ id: entry.id, ...entry.data() }) as Order,
          ),
        );
        setMessage("");
      },
      () =>
        setMessage(
          "Não foi possível carregar os pedidos. Confira as regras do Firestore.",
        ),
    );
  }, [user, verified]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        `${order.id} ${order.customerName}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      ),
    [orders, search],
  );

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;
    setLoading(true);
    setMessage("");
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      setPassword("");
      if (result.user.email !== adminEmail) {
        await signOut(auth);
        setMessage("Esta conta não tem acesso ao painel.");
      }
    } catch {
      setMessage(
        "Não foi possível entrar. Confira o e-mail, a senha e o Firebase Authentication.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;
    if (password.length < 12) {
      setMessage("Escolha uma senha nova com pelo menos 12 caracteres.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        adminEmail,
        password,
      );
      setPassword("");
      try {
        await sendEmailVerification(result.user);
        setMessage("Enviamos um link de verificação para o seu e-mail.");
      } catch (error) {
        setMessage(verificationErrorMessage(error));
      }
    } catch {
      setMessage(
        "Não foi possível criar a conta. Se ela já existe, entre com a senha ou recupere o acesso no Firebase Console.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function refreshVerification() {
    if (!user) return;
    setLoading(true);
    try {
      await reload(user);
      await user.getIdToken(true);
      setVerified(user.emailVerified);
      setMessage(
        user.emailVerified ? "" : "O e-mail ainda não foi verificado.",
      );
    } catch {
      setMessage("Não foi possível atualizar a verificação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function sendVerification() {
    if (!user) return;
    setLoading(true);
    try {
      await sendEmailVerification(user);
      setMessage("Enviamos um link de verificação para o seu e-mail.");
    } catch (error) {
      setMessage(verificationErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: OrderStatus) {
    if (!db) return;
    try {
      await updateDoc(doc(db, "orders", id), { status });
    } catch {
      setMessage("Não foi possível atualizar o pedido. Tente novamente.");
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-topbar container">
        <a href="#inicio" className="admin-back">
          <ArrowLeft size={17} /> Voltar para a loja
        </a>
        <span className="admin-wordmark">
          <span className="admin-wordmark-icon">z</span> Zoo Kids{" "}
          <small>Admin</small>
        </span>
      </header>

      {!firebaseConfigured ? (
        <main className="admin-empty container">
          <div className="admin-empty-icon">
            <ShieldCheck size={32} />
          </div>
          <span className="eyebrow">Painel administrativo</span>
          <h1>O painel está pronto para conectar.</h1>
          <p>
            Crie o projeto Firebase e preencha o arquivo <code>.env.local</code>{" "}
            com a configuração do aplicativo web. Depois, ative o Firestore e o
            Firebase Authentication.
          </p>
          <a href="#inicio" className="button button-dark">
            Voltar para a loja <ArrowUpRight size={18} />
          </a>
        </main>
      ) : !user || user.email !== adminEmail ? (
        <main className="admin-login container">
          <div className="admin-login-copy">
            <span className="eyebrow">Área reservada</span>
            <h1>Seus pedidos, em um só lugar.</h1>
            <p>
              Acompanhe os pedidos enviados pelo site e atualize o andamento do
              atendimento.
            </p>
            <div className="admin-feature">
              <ShoppingBag size={19} /> Pedidos em tempo real
            </div>
            <div className="admin-feature">
              <ShieldCheck size={19} /> Acesso protegido
            </div>
          </div>
          <form
            className="admin-login-card"
            onSubmit={creatingAccount ? handleCreateAccount : handleLogin}
          >
            <span className="card-icon">
              <Mail size={23} />
            </span>
            <h2>{creatingAccount ? "Criar acesso" : "Entrar no painel"}</h2>
            <p>
              {creatingAccount
                ? "Use uma senha nova e confirme o link enviado ao e-mail administrativo."
                : "Use a conta administrativa cadastrada no Firebase."}
            </p>
            <label htmlFor="admin-email">E-mail</label>
            <input
              id="admin-email"
              type="email"
              value={creatingAccount ? adminEmail : email}
              onChange={(event) => setEmail(event.target.value)}
              required
              readOnly={creatingAccount}
              autoComplete="username"
            />
            <label htmlFor="admin-password">Senha</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={creatingAccount ? 12 : undefined}
              autoComplete={creatingAccount ? "new-password" : "current-password"}
            />
            {message && (
              <p className="form-message" role="alert">
                {message}
              </p>
            )}
            <button className="button button-dark full" disabled={loading}>
              {loading
                ? creatingAccount
                  ? "Criando..."
                  : "Entrando..."
                : creatingAccount
                  ? "Criar conta"
                  : "Entrar"}{" "}
              <ArrowUpRight size={18} />
            </button>
            <button
              type="button"
              className="admin-mode-toggle"
              disabled={loading}
              onClick={() => {
                setCreatingAccount((current) => !current);
                setPassword("");
                setMessage("");
              }}
            >
              {creatingAccount ? "Já tenho acesso" : "Primeiro acesso? Criar conta"}
            </button>
          </form>
        </main>
      ) : !verified ? (
        <main className="admin-empty container">
          <div className="admin-empty-icon">
            <Mail size={32} />
          </div>
          <span className="eyebrow">Verificação necessária</span>
          <h1>Confirme seu e-mail para continuar.</h1>
          <p>
            O acesso aos pedidos será liberado após a verificação de{" "}
            <strong>{adminEmail}</strong>.
          </p>
          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
          <div className="admin-actions">
            <button
              className="button button-dark"
              onClick={sendVerification}
              disabled={loading}
            >
              Enviar verificação
            </button>
            <button
              className="button button-outline"
              onClick={refreshVerification}
              disabled={loading}
            >
              <RefreshCw size={16} /> Já verifiquei
            </button>
            <button
              className="button button-outline"
              onClick={() => auth && signOut(auth)}
              disabled={loading}
            >
              <LogOut size={16} /> Sair
            </button>
          </div>
        </main>
      ) : (
        <main className="dashboard container">
          <div className="dashboard-heading">
            <div>
              <span className="eyebrow">Visão geral</span>
              <h1>Painel de pedidos</h1>
              <p>Organize os atendimentos recebidos pelo catálogo.</p>
            </div>
            <button
              className="button button-outline"
              onClick={() => auth && signOut(auth)}
            >
              <LogOut size={17} /> Sair
            </button>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <ShoppingBag size={20} />
              <span>Total de pedidos</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="stat-card">
              <Clock3 size={20} />
              <span>Novos</span>
              <strong>
                {orders.filter((order) => order.status === "novo").length}
              </strong>
            </div>
            <div className="stat-card">
              <PackageCheck size={20} />
              <span>Em atendimento</span>
              <strong>
                {
                  orders.filter((order) => order.status === "em_atendimento")
                    .length
                }
              </strong>
            </div>
            <div className="stat-card">
              <CheckCircle2 size={20} />
              <span>Concluídos</span>
              <strong>
                {orders.filter((order) => order.status === "concluido").length}
              </strong>
            </div>
          </div>
          <section className="orders-panel">
            <div className="orders-toolbar">
              <div>
                <h2>Pedidos recebidos</h2>
                <p>Os pedidos aparecem aqui após o envio para o WhatsApp.</p>
              </div>
              <label className="search-field">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar nome ou pedido"
                  aria-label="Buscar pedido"
                />
              </label>
            </div>
            {message && (
              <p className="form-message" role="alert">
                {message}
              </p>
            )}
            {filteredOrders.length === 0 ? (
              <div className="orders-empty">
                <ShoppingBag size={32} />
                <strong>Nenhum pedido por aqui ainda</strong>
                <p>
                  Quando um cliente enviar um pedido, ele aparecerá nesta lista.
                </p>
              </div>
            ) : (
              <div className="order-list">
                {filteredOrders.map((order) => (
                  <article className="order-card" key={order.id}>
                    <div className="order-card-top">
                      <div>
                        <span className="order-number">
                          Pedido #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <h3>{order.customerName}</h3>
                        <small>{formatDate(order)}</small>
                      </div>
                      <span className={`order-status status-${order.status}`}>
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </div>
                    <ul>
                      {order.items?.map((item, index) => (
                        <li key={`${item.id}-${index}`}>
                          <span>{item.name}</span>
                          <strong>×{item.quantity}</strong>
                        </li>
                      ))}
                    </ul>
                    <div className="order-card-bottom">
                      <span>Atualizar andamento</span>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          changeStatus(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                        aria-label={`Status do pedido ${order.id}`}
                      >
                        <option value="novo">Novo</option>
                        <option value="em_atendimento">Em atendimento</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
