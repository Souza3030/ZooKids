import { useState, type SyntheticEvent } from 'react'

type Product = {
  name: string
  category: 'Body' | 'Kit'
  image: string
  color: 'blue' | 'pink' | 'yellow' | 'mint'
}

const products: Product[] = [
  {
    name: 'Body Super Bebê',
    category: 'Body',
    image: '/fotos/body-super-bebe.jpg',
    color: 'blue',
  },
  {
    name: 'Body Super Pai',
    category: 'Body',
    image: '/fotos/body-super-pai.jpg',
    color: 'pink',
  },
  {
    name: 'Body Mãe Descolada',
    category: 'Body',
    image: '/fotos/body-mae-descolada.jpg',
    color: 'blue',
  },
  {
    name: 'Kit Ursinhos',
    category: 'Kit',
    image: '/fotos/kit-ursinhos.jpg',
    color: 'yellow',
  },
  {
    name: 'Kit Personagens',
    category: 'Kit',
    image: '/fotos/kit-personagens.jpg',
    color: 'mint',
  },
]

const showImageFallback = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.dataset.error = 'true'
  event.currentTarget.hidden = true
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="header">
        <a className="brand" href="#inicio" aria-label="Zoo Kids — início">
          <span className="brand-logo">
            <img
              src="/fotos/logo-zoo-kids.jpg"
              alt="Logo Zoo Kids"
              onError={showImageFallback}
            />
          </span>
          <span className="brand-name">
            <strong>Zoo Kids</strong>
            <small>Moda bebê</small>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Principal">
          <a href="#inicio" onClick={closeMenu}>Início</a>
          <a href="#catalogo" onClick={closeMenu}>Catálogo</a>
          <a className="nav-cta" href="#contato" onClick={closeMenu}>Fale com a gente</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow">Conforto para os pequenos</span>
            <h1>Roupinhas feitas para <em>momentos felizes.</em></h1>
            <p>
              Bodies, conjuntos e peças cheias de carinho para acompanhar cada descoberta.
            </p>
            <a className="primary-button" href="#catalogo">
              Ver catálogo
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="hero-visual" aria-label="Destaque do catálogo">
            <div className="hero-blob" />
            <div className="hero-photo">
              <img
                src="/fotos/bebe-super-bebe.jpg"
                alt="Bebê usando body azul"
                onError={showImageFallback}
              />
              <span className="photo-fallback">Foto em destaque</span>
            </div>
            <span className="floating-star star-one">★</span>
            <span className="floating-star star-two">✦</span>
            <span className="hero-tag">Confortável<br />e divertido</span>
          </div>
        </section>

        <section className="catalog" id="catalogo">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Nosso catálogo</span>
              <h2>Escolha o seu favorito</h2>
            </div>
            <p>Modelos leves, alegres e pensados para o dia a dia.</p>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.name}>
                <div className={`product-image ${product.color}`}>
                  <img src={product.image} alt={product.name} onError={showImageFallback} />
                  <span className="image-fallback">Zoo Kids</span>
                  <span className="category-pill">{product.category}</span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <a href="#contato" aria-label={`Consultar ${product.name}`}>
                    Consultar <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="contato">
          <div>
            <span className="eyebrow light">Gostou de algum modelo?</span>
            <h2>Vamos escolher o look do seu pequeno?</h2>
          </div>
          <p>
            Entre em contato para saber tamanhos, cores e disponibilidade das peças.
          </p>
          <span className="secondary-button" aria-label="Canal de contato ainda não informado">
            Contato em breve
          </span>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark">Z</span>
          <span className="brand-name"><strong>Zoo Kids</strong><small>Moda bebê</small></span>
        </a>
        <p>Roupinhas que abraçam cada fase.</p>
        <span>© {new Date().getFullYear()} Zoo Kids</span>
      </footer>
    </div>
  )
}

export default App
