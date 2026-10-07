import type { CartItem } from "./catalog";
import { products } from "./catalog";

export type OrderStatus = "novo" | "em_atendimento" | "concluido" | "cancelado";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  source: "site";
  createdAt?: { toDate: () => Date };
};

export const whatsappNumber = "5581993712933";

export function resolveCart(items: CartItem[]): OrderItem[] {
  return items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product
      ? [{ id: product.id, name: product.name, quantity: item.quantity }]
      : [];
  });
}

export function orderWhatsappUrl(
  orderId: string,
  customerName: string,
  items: OrderItem[],
): string {
  const lines = [
    "Olá, Zoo Kids! Gostaria de consultar este pedido:",
    `Pedido: ${orderId}`,
    `Nome: ${customerName}`,
    "",
    ...items.map((item) => `${item.quantity}× ${item.name}`),
    "",
    "Podem me informar tamanhos, disponibilidade e valores?",
  ];
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
