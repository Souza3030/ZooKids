const verificationHints: Record<string, string> = {
  "auth/too-many-requests":
    "O Firebase limitou os envios. Aguarde antes de tentar novamente e confira também a pasta Spam.",
  "auth/quota-exceeded":
    "O limite de e-mails do projeto Firebase foi atingido. Consulte as cotas no Firebase Console e tente novamente mais tarde.",
  "auth/network-request-failed":
    "O navegador não conseguiu acessar o Firebase. Verifique a conexão e possíveis bloqueadores de rede.",
  "auth/operation-not-allowed":
    "O envio não está disponível neste projeto. Confira se E-mail/senha está ativado no Firebase Authentication.",
  "auth/unauthorized-continue-uri":
    "O domínio do site não está autorizado. Adicione-o em Authentication → Configurações → Domínios autorizados.",
  "auth/invalid-continue-uri":
    "O endereço de retorno da verificação é inválido. Confira os domínios autorizados no Firebase Authentication.",
  "auth/invalid-app-credential":
    "A verificação do aplicativo foi recusada. Confira a configuração do Firebase App Check.",
  "auth/user-token-expired":
    "Sua sessão expirou. Saia do painel, entre novamente e reenvie a verificação.",
  "auth/invalid-user-token":
    "Sua sessão expirou. Saia do painel, entre novamente e reenvie a verificação.",
  "auth/requires-recent-login":
    "Entre novamente no painel e tente reenviar a verificação.",
};

export function verificationErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    /^auth\/[a-z-]+$/.test(error.code)
      ? error.code
      : null;

  const hint = code
    ? verificationHints[code] ?? "Consulte o erro no Firebase Authentication."
    : "Confira a conexão e tente novamente.";

  return `Não foi possível enviar o e-mail de verificação. ${hint}${code ? ` (erro ${code})` : ""}`;
}
