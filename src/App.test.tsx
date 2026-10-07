// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { orderWhatsappUrl, resolveCart, whatsappNumber } from "./orders";

beforeEach(() => {
  window.location.hash = "";
  localStorage.clear();
});

afterEach(() => cleanup());

describe("catálogo e carrinho", () => {
  it("filtra produtos e mantém as escolhas no navegador", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Macacões" }));
    expect(screen.getByText("Macacão Nuvens")).toBeTruthy();
    expect(screen.queryByText("Body Super Bebê")).toBeNull();

    await user.click(
      screen.getByRole("button", {
        name: "Adicionar Macacão Nuvens ao carrinho",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: /Abrir carrinho com 1 itens/ }),
    );

    const drawer = screen.getByRole("dialog", { name: "Seu carrinho" });
    expect(within(drawer).getByText("Macacão Nuvens")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("zookids-cart-v1") ?? "[]")).toEqual(
      [{ productId: "macacao-nuvens", quantity: 1 }],
    );
    expect(
      within(drawer)
        .getByRole("button", { name: /Finalizar no WhatsApp/ })
        .hasAttribute("disabled"),
    ).toBe(true);
  });

  it("monta a mensagem de pedido com número e itens corretos", () => {
    const items = resolveCart([{ productId: "kit-ursinhos", quantity: 2 }]);
    const url = new URL(orderWhatsappUrl("pedido123", "Ana", items));
    expect(url.pathname).toBe(`/${whatsappNumber}`);
    expect(url.searchParams.get("text")).toContain("Pedido: pedido123");
    expect(url.searchParams.get("text")).toContain("2× Kit Ursinhos");
  });
});

describe("painel administrativo", () => {
  it("informa que falta configurar o Firebase antes do acesso", async () => {
    window.location.hash = "#admin";
    render(<App />);
    expect(
      await screen.findByText("O painel está pronto para conectar."),
    ).toBeTruthy();
  });
});
