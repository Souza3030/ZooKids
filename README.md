# Zoo Kids

Catálogo responsivo em React + TypeScript + Vite, com carrinho, pedidos via WhatsApp e painel de pedidos no Firestore.

## Executar localmente

Requer Node.js 20.19+ ou 22.12+.

```bash
npm ci
npm run dev
```

Abra a URL mostrada pelo Vite. Para rodar os testes, verificar a tipagem e gerar a versão de produção:

```bash
npm run typecheck
npm run test
npm run build
```

## Configurar Firebase

O site e o carrinho funcionam sem Firebase, mas a finalização de pedidos e o painel administrativo só são liberados depois desta configuração. Isso evita enviar um pedido pelo WhatsApp sem registrá-lo no banco.

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/), registre um aplicativo web e crie um banco Cloud Firestore.
2. Em Authentication, ative os provedores **Anônimo** (clientes) e **E-mail/senha** (administração).
3. Copie `.env.example` para `.env.local` e preencha as quatro variáveis `VITE_FIREBASE_*` com a configuração pública do aplicativo web. Não coloque senha ou chave privada nesse arquivo.
4. Publique as regras de `firestore.rules` no Firestore. Se usar Firebase CLI, execute `npx firebase-tools deploy --only firestore:rules --project SEU_PROJECT_ID` depois de autenticar com a sua conta. As regras permitem criar pedidos a usuários autenticados e ler/alterar o status apenas à conta administrativa verificada.
5. Crie no Firebase Authentication a conta `acessozookids@gmail.com` com uma **senha nova**. A senha enviada na conversa não foi salva no projeto e não deve ser reutilizada. Entre em `/#admin`, envie a verificação de e-mail e confirme o link recebido.
6. Se hospedar o site em outro domínio, adicione-o aos domínios autorizados do Authentication. Configure as variáveis `VITE_FIREBASE_*` também no ambiente de build da hospedagem.

O fluxo da compra é: carrinho no navegador → registro do pedido no Firestore → WhatsApp `+55 81 99371-2933` com o número e os itens do pedido. O painel `/#admin` mostra pedidos em tempo real e permite mudar o status. O site não processa pagamento. Tamanhos, disponibilidade e valores são combinados no atendimento.

## Catálogo e imagens

Os 12 produtos em `src/catalog.ts` são um catálogo inicial **ilustrativo**. Os nomes adicionais, descrições, preços e disponibilidade precisam ser revisados antes da divulgação. A imagem da página inicial em `public/loja-infantil.webp` foi gerada para representar uma loja fictícia, e está identificada como ilustrativa no site.

As fotos de produtos e a logo enviadas no chat não foram disponibilizadas como arquivos. Para mostrar as cinco fotos mencionadas anteriormente, coloque-as em `public/fotos` com os nomes indicados em [`public/fotos/ADICIONE-AS-FOTOS-AQUI.txt`](public/fotos/ADICIONE-AS-FOTOS-AQUI.txt). Os outros produtos exibem imagens de substituição até receberem fotos.

## Segurança

O endereço de e-mail do administrador não é uma senha. A autorização de leitura do painel é aplicada pelas regras do Firestore e exige conta autenticada com e-mail verificado. Antes de publicar para clientes, configure Firebase App Check para reduzir envios automatizados e teste o fluxo de compra e a leitura do painel com o projeto real.
