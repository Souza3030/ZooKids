// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { placeOrder } from "./checkout";

vi.mock("./config", () => ({
  firebaseConfigured: true,
  adminEmail: "acessozookids@gmail.com",
}));
vi.mock("./checkout", () => ({
  placeOrder: vi.fn(async () => "pedido123"),
}));

beforeEach(() => {
  vi.clearAllMocks();
  window.location.hash = "";
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function submitOrder() {
  const user = userEvent.setup();
  render(<App />);
  await user.click(
    screen.getByRole("button", { name: "Adicionar Body Super Bebê ao carrinho" }),
  );
  await user.click(screen.getByRole("button", { name: /Abrir carrinho com 1 itens/ }));
  const drawer = screen.getByRole("dialog", { name: "Seu carrinho" });
  await user.type(within(drawer).getByLabelText("Seu nome"), "Ana");
  await user.click(within(drawer).getByRole("button", { name: /Finalizar no WhatsApp/ }));
  return drawer;
}

describe("finalização do pedido", () => {
  it("registra o pedido e abre o WhatsApp em outra aba", async () => {
    const replace = vi.fn();
    const tab = {
      opener: {},
      closed: false,
      document: { title: "", body: { textContent: "" } },
      location: { replace },
      close: vi.fn(),
    } as unknown as Window;
    const open = vi.spyOn(window, "open").mockReturnValue(tab);

    const drawer = await submitOrder();

    expect(open).toHaveBeenCalledWith("", "_blank");
    await waitFor(() => expect(replace).toHaveBeenCalledOnce());
    expect(placeOrder).toHaveBeenCalledWith("Ana", [
      expect.objectContaining({ id: "body-super-bebe", quantity: 1 }),
    ]);
    expect(new URL(replace.mock.calls[0][0]).pathname).toBe("/5581993712933");
    expect(tab.opener).toBeNull();
    expect(within(drawer).getByText("Pedido registrado!")).toBeTruthy();
    const fallback = within(drawer).getByRole("link", { name: /Abrir WhatsApp/ });
    expect(fallback.getAttribute("target")).toBe("_blank");
    expect(fallback.getAttribute("rel")).toContain("noopener");
  });

  it("oferece um link quando o navegador bloqueia a nova aba", async () => {
    vi.spyOn(window, "open").mockReturnValue(null);

    const drawer = await submitOrder();

    expect(await within(drawer).findByText("Pedido registrado!")).toBeTruthy();
    expect(within(drawer).getByRole("link", { name: /Abrir WhatsApp/ })).toBeTruthy();
  });

  it("fecha a aba de espera e mantém o carrinho se o registro falhar", async () => {
    vi.mocked(placeOrder).mockRejectedValueOnce(new Error("Firestore indisponível"));
    const close = vi.fn();
    const replace = vi.fn();
    vi.spyOn(window, "open").mockReturnValue({
      opener: {},
      document: { title: "", body: { textContent: "" } },
      close,
      closed: false,
      location: { replace },
    } as unknown as Window);

    const drawer = await submitOrder();

    expect(
      await within(drawer).findByText(/Não foi possível registrar o pedido/),
    ).toBeTruthy();
    expect(close).toHaveBeenCalledOnce();
    expect(replace).not.toHaveBeenCalled();
    expect(within(drawer).getByText("Body Super Bebê")).toBeTruthy();
  });
});
