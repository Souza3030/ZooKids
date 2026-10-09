import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type SyntheticEvent,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Baby,
  Check,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  categories,
  currencyNote,
  products,
  type CartItem,
  type Category,
  type Product,
} from "./catalog";
import { firebaseConfigured } from "./config";
import { orderWhatsappUrl, resolveCart, whatsappNumber } from "./orders";

const cartStorageKey = "zookids-cart-v1";
const AdminPanel = lazy(() => import("./AdminPanel"));

function readCart(): CartItem[] {
  try {
    const stored = JSON.parse(localStorage.getItem(cartStorageKey) ?? "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter(
      (item): item is CartItem =>
        typeof item?.productId === "string" &&
        products.some((product) => product.id === item.productId) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 99,
    );
  } catch {
    return [];
  }
}

function ProductImage({ product }: { product: Product }) {
  const hideBrokenImage = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.hidden = true;
  };
  return (
    <div className={`product-image tone-${product.tone}`}>
      <span className="product-placeholder" aria-hidden="true">
        <span>{product.emoji}</span>
        <small>Zoo Kids</small>
      </span>
      {product.image && (
        <img
          src={product.image}
          alt={`Imagem ilustrativa de ${product.name}`}
          className={product.imageTile ? `product-photo-sheet tile-${product.imageTile}` : undefined}
          loading="lazy"
          onError={hideBrokenImage}
        />
      )}
      {product.badge && <span className="product-badge">{product.badge}</span>}
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(
    window.location.hash === "#admin" ? "admin" : "shop",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("Todos");
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [addedProduct, setAddedProduct] = useState<string | null>(null);

  useEffect(() => {
    const onHashChange = () =>
      setRoute(window.location.hash === "#admin" ? "admin" : "shop");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    document.body.classList.toggle("drawer-open", cartOpen);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("drawer-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cartOpen]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          activeCategory === "Todos" || product.category === activeCategory;
        const matchesSearch =
          `${product.name} ${product.description} ${product.category}`
            .toLowerCase()
            .includes(search.toLowerCase().trim());
        return matchesCategory && matchesSearch;
      }),
    [activeCategory, search],
  );
  const cartItems = useMemo(() => resolveCart(cart), [cart]);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  function addToCart(productId: string) {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing)
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item,
        );
      return [...current, { productId, quantity: 1 }];
    });
    setAddedProduct(productId);
    window.setTimeout(
      () =>
        setAddedProduct((current) => (current === productId ? null : current)),
      1800,
    );
  }

  function updateQuantity(productId: string, change: number) {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.productId !== productId) return [item];
        const quantity = Math.min(99, item.quantity + change);
        return quantity > 0 ? [{ ...item, quantity }] : [];
      }),
    );
  }

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firebaseConfigured || cartItems.length === 0 || checkoutLoading)
      return;
    const name = customerName.trim();
    if (name.length < 2 || name.length > 80) {
      setCheckoutError("Informe seu nome com 2 a 80 caracteres.");
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const { placeOrder } = await import("./checkout");
      const orderId = await placeOrder(name, cartItems);
      setCart([]);
      window.location.assign(orderWhatsappUrl(orderId, name, cartItems));
    } catch {
      setCheckoutError(
        "Não foi possível registrar o pedido. Verifique a conexão e tente novamente.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (route === "admin")
    return (
      <Suspense
        fallback={
          <div className="admin-page admin-loading">Carregando painel...</div>
        }
      >
        <AdminPanel />
      </Suspense>
    );

  return (
    <div className="site-shell">
      <div className="announcement">
        <Sparkles size={14} /> Um mundo de carinho para os pequenos{" "}
        <Sparkles size={14} />
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a
            className="brand"
            href="#inicio"
            onClick={() => setMenuOpen(false)}
            aria-label="Zoo Kids, voltar ao início"
          >
            <span className="brand-icon">
              <img src="/zookids-logo.png" alt="" />
            </span>
            <span className="brand-text">
              <strong>zoo kids</strong>
              <small>MODA BEBÊ</small>
            </span>
          </a>
          <nav
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            aria-label="Navegação principal"
          >
            <a href="#inicio" onClick={() => setMenuOpen(false)}>
              Início
            </a>
            <a href="#catalogo" onClick={() => setMenuOpen(false)}>
              Catálogo
            </a>
            <a href="#sobre" onClick={() => setMenuOpen(false)}>
              Sobre nós
            </a>
            <a href="#contato" onClick={() => setMenuOpen(false)}>
              Contato
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="cart-trigger"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrinho com ${itemCount} itens`}
            >
              <ShoppingBag size={20} />
              <span>Carrinho</span>
              {itemCount > 0 && <b>{itemCount}</b>}
            </button>
            <button
              className="mobile-menu"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero container" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" /> PEQUENOS MOMENTOS, GRANDES
              MEMÓRIAS
            </span>
            <h1>
              Roupinhas para <em>crescer sorrindo.</em>
            </h1>
            <p>
              Do primeiro abraço às novas aventuras, a Zoo Kids tem looks cheios
              de conforto, cor e carinho.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#catalogo">
                Explorar catálogo <ArrowUpRight size={19} />
              </a>
              <a className="text-link" href="#sobre">
                Conheça a Zoo Kids <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-social-proof">
              <div className="hero-mini-icons">
                <span>♥</span>
                <span>★</span>
                <span>✿</span>
              </div>
              <small>
                Moda feita para acompanhar
                <br />
                cada descoberta.
              </small>
            </div>
          </div>
          <div className="hero-art">
            <img
              className="hero-store-image"
              src="/loja-infantil.webp"
              alt="Ilustração fotográfica de uma loja infantil com roupas para bebê"
            />
            <img
              className="hero-brand-mark"
              src="/zookids-logo.png"
              alt=""
              aria-hidden="true"
            />
            <span className="hero-image-note">Imagem ilustrativa da loja</span>
            <div className="hero-sticker">
              <Heart size={24} fill="currentColor" />
              <span>
                feito com
                <br />
                <strong>carinho</strong>
              </span>
            </div>
          </div>
        </section>
        <section className="benefits" aria-label="Benefícios">
          <div className="container benefits-grid">
            <div>
              <span className="benefit-icon pink">
                <Heart size={22} />
              </span>
              <span>
                <strong>Feito com carinho</strong>
                <small>Detalhes que encantam</small>
              </span>
            </div>
            <div>
              <span className="benefit-icon blue">
                <Baby size={22} />
              </span>
              <span>
                <strong>Para cada fase</strong>
                <small>Do recém-nascido à infância</small>
              </span>
            </div>
            <div>
              <span className="benefit-icon yellow">
                <Truck size={22} />
              </span>
              <span>
                <strong>Atendimento próximo</strong>
                <small>Converse pelo WhatsApp</small>
              </span>
            </div>
          </div>
        </section>
        <section className="catalog-section" id="catalogo">
          <div className="container">
            <div className="section-intro">
              <div>
                <span className="eyebrow">O MUNDO ZOO KIDS</span>
                <h2>
                  Peças para todas as <em>aventuras.</em>
                </h2>
              </div>
              <p>
                Descubra opções para deixar cada momento ainda mais especial.
              </p>
            </div>
            <div className="catalog-controls">
              <div
                className="category-tabs"
                role="group"
                aria-label="Filtrar por categoria"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      activeCategory === category
                        ? "category-tab active"
                        : "category-tab"
                    }
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="catalog-search">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar roupinha..."
                  aria-label="Buscar no catálogo"
                />
              </label>
            </div>
            <p className="catalog-count">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </p>
            {filteredProducts.length === 0 ? (
              <div className="catalog-empty">
                <Search size={30} />
                <h3>Nenhuma peça encontrada</h3>
                <p>Tente outra busca ou escolha uma categoria diferente.</p>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <ProductImage product={product} />
                    <div className="product-meta">
                      <span>{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="product-bottom">
                        <small>{currencyNote}</small>
                        <button
                          type="button"
                          onClick={() => addToCart(product.id)}
                          aria-label={`Adicionar ${product.name} ao carrinho`}
                        >
                          {addedProduct === product.id ? (
                            <Check size={17} />
                          ) : (
                            <Plus size={17} />
                          )}
                          {addedProduct === product.id
                            ? "Adicionado"
                            : "Adicionar"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="catalog-disclaimer">
              Catálogo ilustrativo. Consulte tamanhos, cores, preços e
              disponibilidade antes de concluir a compra.
            </p>
          </div>
        </section>
        <section className="about-section container" id="sobre">
          <div className="about-illustration">
            <div className="about-card">
              <span>✦</span>
              <Baby size={74} strokeWidth={1.25} />
              <span>♡</span>
            </div>
            <div className="about-tag">Toda infância merece cor!</div>
          </div>
          <div className="about-content">
            <span className="eyebrow">PRAZER, SOMOS A ZOO KIDS</span>
            <h2>Moda para viver a infância com leveza.</h2>
            <p>
              Acreditamos que cada descoberta merece uma roupa confortável e
              cheia de alegria. Por aqui, escolhemos peças para acompanhar os
              pequenos em cada fase.
            </p>
            <div className="about-points">
              <span>
                <Check size={18} /> Estilo e diversão
              </span>
              <span>
                <Check size={18} /> Carinho em cada escolha
              </span>
            </div>
            <a href="#catalogo" className="button button-outline">
              Ver as roupinhas <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section className="contact-section" id="contato">
          <div className="container contact-inner">
            <div>
              <span className="eyebrow">VAMOS CONVERSAR?</span>
              <h2>O look favorito do seu pequeno está esperando.</h2>
              <p>
                Fale com a Zoo Kids para confirmar detalhes dos produtos e tirar
                suas dúvidas.
              </p>
            </div>
            <a
              className="button button-light"
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              Chamar no WhatsApp <ArrowUpRight size={19} />
            </a>
            <div className="contact-deco" aria-hidden="true">
              ✿
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-about">
              <a className="brand" href="#inicio">
                <span className="brand-icon">
                  <img src="/zookids-logo.png" alt="" />
                </span>
                <span className="brand-text">
                  <strong>zoo kids</strong>
                  <small>MODA BEBÊ</small>
                </span>
              </a>
              <p>
                Roupinhas cheias de afeto para acompanhar a alegria de crescer.
              </p>
              <a
                className="footer-social"
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Zoo Kids"
              >
                <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="footer-column">
              <h3>Explore</h3>
              <a href="#inicio">Início</a>
              <a href="#catalogo">Catálogo</a>
              <a href="#sobre">Sobre nós</a>
              <a href="#contato">Contato</a>
            </div>
            <div className="footer-column">
              <h3>Categorias</h3>
              {(["Bodies", "Conjuntos", "Macacões", "Kits"] as Category[]).map(
                (category) => (
                  <a
                    key={category}
                    href="#catalogo"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </a>
                ),
              )}
            </div>
            <div className="footer-column">
              <h3>Atendimento</h3>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <p>
                Atendimento pelo WhatsApp
                <br />
                Horários sob consulta
              </p>
              <a className="footer-admin" href="#admin">
                Painel administrativo
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Zoo Kids. Feito com carinho.
            </span>
            <span>
              Moda bebê e infantil <Heart size={14} fill="currentColor" />
            </span>
          </div>
        </div>
      </footer>

      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Seu carrinho"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <div>
                <span className="eyebrow">SUAS ESCOLHAS</span>
                <h2>
                  Meu carrinho <span>({itemCount})</span>
                </h2>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Fechar carrinho"
              >
                <X size={21} />
              </button>
            </div>
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <span>
                  <ShoppingBag size={38} />
                </span>
                <h3>Seu carrinho está vazio</h3>
                <p>Que tal escolher uma roupinha para começar?</p>
                <button
                  className="button button-dark"
                  type="button"
                  onClick={() => setCartOpen(false)}
                >
                  Ver catálogo <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => {
                    const product = products.find(
                      (entry) => entry.id === item.id,
                    )!;
                    return (
                      <div className="cart-item" key={item.id}>
                        <div className={`cart-thumb tone-${product.tone}`}>
                          {product.emoji}
                        </div>
                        <div className="cart-item-info">
                          <small>{product.category}</small>
                          <strong>{product.name}</strong>
                          <span>{currencyNote}</span>
                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label={`Diminuir quantidade de ${item.name}`}
                            >
                              <Minus size={14} />
                            </button>
                            <b>{item.quantity}</b>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label={`Aumentar quantidade de ${item.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="remove-item"
                          type="button"
                          onClick={() =>
                            setCart((current) =>
                              current.filter(
                                (entry) => entry.productId !== item.id,
                              ),
                            )
                          }
                          aria-label={`Remover ${item.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <form className="checkout-box" onSubmit={handleCheckout}>
                  <div className="checkout-note">
                    <ShieldCheck size={19} />
                    <p>
                      Seu pedido será registrado antes de abrir o WhatsApp.
                      Valores e tamanhos serão confirmados no atendimento.
                    </p>
                  </div>
                  <label htmlFor="customer-name">Seu nome</label>
                  <input
                    id="customer-name"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="Como podemos chamar você?"
                    autoComplete="name"
                  />
                  {!firebaseConfigured && (
                    <p className="form-message" role="status">
                      O pedido online será liberado após a conexão com o
                      Firebase. Você ainda pode falar com a loja pelo WhatsApp.
                    </p>
                  )}
                  {checkoutError && (
                    <p className="form-message" role="alert">
                      {checkoutError}
                    </p>
                  )}
                  <button
                    className="button button-dark full"
                    type="submit"
                    disabled={!firebaseConfigured || checkoutLoading}
                  >
                    {checkoutLoading
                      ? "Registrando pedido..."
                      : "Finalizar no WhatsApp"}{" "}
                    <ArrowUpRight size={18} />
                  </button>
                  <a
                    className="cart-direct-link"
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Só quero tirar uma dúvida <ArrowUpRight size={14} />
                  </a>
                </form>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
