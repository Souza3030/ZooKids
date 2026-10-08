import { describe, expect, it } from "vitest";
import { verificationErrorMessage } from "./authMessages";

describe("mensagens de verificação", () => {
  it("explica quando o Firebase limita os envios", () => {
    expect(
      verificationErrorMessage({ code: "auth/too-many-requests" }),
    ).toContain("limitou os envios");
  });

  it("mostra o código de erros desconhecidos sem expor outros dados", () => {
    expect(
      verificationErrorMessage({ code: "auth/internal-error", password: "secret" }),
    ).toContain("erro auth/internal-error");
    expect(
      verificationErrorMessage({ code: "auth/internal-error", password: "secret" }),
    ).not.toContain("secret");
  });
});
