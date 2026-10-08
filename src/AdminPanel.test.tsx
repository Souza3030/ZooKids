// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdminPanel from "./AdminPanel";

vi.mock("./firebase", () => ({
  adminEmail: "acessozookids@gmail.com",
  auth: null,
  db: null,
  firebaseConfigured: true,
}));

afterEach(() => cleanup());

describe("primeiro acesso administrativo", () => {
  it("permite escolher uma senha nova para o e-mail administrativo", async () => {
    const user = userEvent.setup();
    render(<AdminPanel />);

    await user.click(screen.getByRole("button", { name: "Primeiro acesso? Criar conta" }));

    expect(screen.getByRole("heading", { name: "Criar acesso" })).toBeTruthy();
    expect((screen.getByLabelText("E-mail") as HTMLInputElement).value).toBe(
      "acessozookids@gmail.com",
    );
    expect(screen.getByLabelText("E-mail").hasAttribute("readonly")).toBe(true);
    expect(screen.getByLabelText("Senha").getAttribute("minlength")).toBe("12");
    expect(screen.getByRole("button", { name: /Criar conta/ })).toBeTruthy();
  });
});
