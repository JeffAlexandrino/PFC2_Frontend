## Como rodar localmente

### Instale o NodeJs

Para rodar o projeto localmente, é necessário instalar o [NodeJs](https://nodejs.org/en/download/package-manager).

### Instale o Yarn

Recomenda-se instalar o [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) para gerenciar as dependências do projeto.

### Defina as variáveis de ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env`.
2. Copie o conteúdo do arquivo `.env.example` para o novo arquivo `.env`.
3. Ajuste os valores das variáveis conforme o seu ambiente local.

### Instale as dependências e rode o projeto

Para instalar as dependências e iniciar o projeto, execute no terminal, na raiz do repositório:

```
yarn
yarn start
```

## Testes

### Como rodar os testes localmente

1. Certifique que o backend _não_ está rodando.
2. Abra um terminal e execute o serviço do Frontend com `yarn start`.
3. Em outro terminal, na raiz do projeto, execute `yarn cy:open`.
   Uma janela do Cypress será aberta. Nela, selecione o tipo de teste desejado e, em seguida, escolha o navegador (testado no Google Chrome).