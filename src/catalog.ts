export type Category =
  "Bodies" | "Conjuntos" | "Macacões" | "Kits" | "Acessórios";

export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  image?: string;
  imageTile?: "tl" | "tr" | "bl" | "br";
  emoji: string;
  tone: "peach" | "blue" | "lilac" | "mint" | "butter";
  badge?: string;
};

// Imagens geradas para ilustrar o catálogo; elas não representam estoque fotografado.
// Tamanhos, disponibilidade e preços são confirmados no atendimento.
export const products: Product[] = [
  {
    id: "body-super-bebe",
    name: "Body Super Bebê",
    category: "Bodies",
    description: "Um look divertido para os pequenos heróis.",
    image: "/catalogo/bodies.png",
    imageTile: "tl",
    emoji: "⭐",
    tone: "blue",
    badge: "Queridinho",
  },
  {
    id: "body-super-pai",
    name: "Body Super Pai",
    category: "Bodies",
    description: "Uma declaração de carinho em forma de body.",
    image: "/catalogo/bodies.png",
    imageTile: "tr",
    emoji: "💗",
    tone: "peach",
  },
  {
    id: "body-mae-descolada",
    name: "Body Mãe Descolada",
    category: "Bodies",
    description: "Para uma dupla cheia de personalidade.",
    image: "/catalogo/bodies.png",
    imageTile: "bl",
    emoji: "💙",
    tone: "blue",
  },
  {
    id: "kit-ursinhos",
    name: "Kit Ursinhos",
    category: "Kits",
    description: "Dois bodies para variar nos passeios.",
    image: "/catalogo/conjuntos.png",
    imageTile: "br",
    emoji: "🐻",
    tone: "butter",
    badge: "Kit",
  },
  {
    id: "kit-personagens",
    name: "Kit Personagens",
    category: "Kits",
    description: "Uma dupla alegre para o dia a dia.",
    image: "/catalogo/kits-macacoes.png",
    imageTile: "tl",
    emoji: "🎨",
    tone: "mint",
    badge: "Kit",
  },
  {
    id: "body-primeiros-sorrisos",
    name: "Body Primeiros Sorrisos",
    category: "Bodies",
    description: "Básico delicado para começar o dia.",
    image: "/catalogo/bodies.png",
    imageTile: "br",
    emoji: "☀️",
    tone: "peach",
  },
  {
    id: "body-pequena-aventura",
    name: "Body Pequena Aventura",
    category: "Bodies",
    description: "Para acompanhar novas descobertas.",
    image: "/catalogo/conjuntos.png",
    imageTile: "tl",
    emoji: "🌈",
    tone: "lilac",
  },
  {
    id: "conjunto-dia-feliz",
    name: "Conjunto Dia Feliz",
    category: "Conjuntos",
    description: "Conforto para brincar e explorar.",
    image: "/catalogo/conjuntos.png",
    imageTile: "tr",
    emoji: "🌼",
    tone: "butter",
  },
  {
    id: "conjunto-passeio",
    name: "Conjunto Passeio",
    category: "Conjuntos",
    description: "Um look leve para sair com a família.",
    image: "/catalogo/conjuntos.png",
    imageTile: "bl",
    emoji: "🧸",
    tone: "mint",
  },
  {
    id: "macacao-nuvens",
    name: "Macacão Nuvens",
    category: "Macacões",
    description: "Aconchego para as primeiras aventuras.",
    image: "/catalogo/kits-macacoes.png",
    imageTile: "tr",
    emoji: "☁️",
    tone: "blue",
  },
  {
    id: "macacao-doce-sonho",
    name: "Macacão Doce Sonho",
    category: "Macacões",
    description: "Um abraço macio para o bebê.",
    image: "/catalogo/kits-macacoes.png",
    imageTile: "bl",
    emoji: "🌙",
    tone: "lilac",
  },
  {
    id: "acessorio-lacinho",
    name: "Lacinho Encanto",
    category: "Acessórios",
    description: "Um detalhe especial no look.",
    image: "/catalogo/kits-macacoes.png",
    imageTile: "br",
    emoji: "🎀",
    tone: "peach",
  },
];

export const categories = [
  "Todos",
  "Bodies",
  "Conjuntos",
  "Macacões",
  "Kits",
  "Acessórios",
] as const;

export type CartItem = { productId: string; quantity: number };

export const currencyNote = "Preço sob consulta";
