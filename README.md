# Zoo Kids

Catálogo responsivo em React + TypeScript + Vite, com carrinho, pedidos via WhatsApp e painel de pedidos no Firestore.

## Executar localmente

Requer Node.js 20.19+ ou 22.12+.

```bash
npm ci
npm run dev
```

Abra a URL mostrada pelo Vite (normalmente `http://localhost:5173/`). Para abrir o painel administrativo, acrescente `#admin` ao final dessa URL: `http://localhost:5173/#admin`. Se o site estiver publicado, use o endereço público do site com `#admin` ao final, por exemplo `https://seu-site.com/#admin`. O endereço do repositório GitHub não é o site em execução.

Para rodar os testes, verificar a tipagem e gerar a versão de produção:

```bash
npm run typecheck
npm run test
npm run build
```

## Configurar Firebase

A configuração pública do aplicativo web do projeto `zookids-95d7f` já está em `src/config.ts`. As variáveis `VITE_FIREBASE_*` continuam disponíveis para substituir essa configuração em outros ambientes. A finalização de pedidos e o painel administrativo dependem também das etapas abaixo; isso evita enviar um pedido pelo WhatsApp sem registrá-lo no banco.

1. No [Firebase Console](https://console.firebase.google.com/), abra o projeto `zookids-95d7f` e crie o banco Cloud Firestore, se ainda não existir.
2. Em Authentication, ative os provedores **Anônimo** (clientes) e **E-mail/senha** (administração).
3. No menu Firestore Database → **Regras**, substitua o conteúdo pelas regras de `firestore.rules` e clique em **Publicar**. Se usar Firebase CLI, execute `npx firebase-tools deploy --only firestore:rules --project zookids-95d7f` depois de autenticar com a sua conta. As regras permitem criar pedidos a usuários autenticados e ler/alterar o status apenas à conta administrativa verificada.
4. Abra o painel pelo endereço explicado acima e clique em **Primeiro acesso? Criar conta**. O e-mail `acessozookids@gmail.com` já estará preenchido; escolha uma **senha nova**, de pelo menos 12 caracteres, e confirme o link recebido por e-mail. Depois, volte ao painel e clique em **Já verifiquei**. Também é possível criar essa conta pelo Firebase Authentication e depois entrar no painel. A senha enviada na conversa não foi salva no projeto e não deve ser reutilizada. Somente a conta com esse e-mail verificado pode ler pedidos pelas regras do Firestore.
5. Se hospedar o site em outro domínio, adicione-o aos domínios autorizados do Authentication. Não coloque senha ou chave privada nas variáveis `VITE_FIREBASE_*`.

Se o botão **Enviar verificação** falhar, o painel mostra agora o código retornado pelo Firebase. Confira também Spam/Lixo eletrônico. Para `auth/too-many-requests`, aguarde antes de tentar de novo; para `auth/unauthorized-continue-uri`, adicione o domínio em Authentication → Configurações → Domínios autorizados. Se persistir, informe o código mostrado na tela, sem compartilhar senha ou link de verificação.

O fluxo da compra é: carrinho no navegador → registro do pedido no Firestore → WhatsApp `+55 81 99371-2933` em **outra aba**, com o número e os itens do pedido. Se o navegador bloquear a nova aba, o carrinho mostra um link para abrir o WhatsApp. O painel `/#admin` mostra pedidos em tempo real e permite mudar o status. O site não processa pagamento. Tamanhos, disponibilidade e valores são combinados no atendimento.

## Catálogo e imagens

Os 12 produtos em `src/catalog.ts` são um catálogo inicial **ilustrativo**. Cada produto tem sua própria imagem WebP em `public/catalogo`, gerada a partir do estilo da referência enviada; elas **não são fotos do estoque real**. A marca em `public/zookids-logo.png` foi recriada a partir da imagem da Zoo Kids enviada no chat. A imagem da página inicial em `public/loja-infantil.webp` representa uma loja fictícia e também está identificada como ilustrativa.

Antes de divulgar ou aceitar pedidos, confirme nomes, estampas, tamanhos, preços e disponibilidade com o estoque. Para trocar uma imagem gerada por uma foto real, coloque a foto em `public/fotos` e altere o campo `image` do produto em `src/catalog.ts`.

## Segurança

O endereço de e-mail do administrador não é uma senha. A autorização de leitura do painel é aplicada pelas regras do Firestore e exige conta autenticada com e-mail verificado. Antes de publicar para clientes, configure Firebase App Check para reduzir envios automatizados e teste o fluxo de compra e a leitura do painel com o projeto real.
