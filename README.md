# Sebo Online - Front-End (React + Bootstrap) & Back-End Integration

## Descrição do Projeto

Este projeto foi desenvolvido como parte de um desafio técnico, com o objetivo de criar um site utilizando **React**, **Bootstrap**, **HTML**, e a integração com o **back-end** de um projeto anterior. O site contém três abas principais: **Início**, **Livros Disponíveis** e **Lista de Desejos**. O objetivo é permitir aos usuários visualizar os livros disponíveis no acervo do sebo e gerenciar suas listas de desejos.

## Tecnologias Utilizadas

- **Front-End**:
  - **React.js**: Criação de componentes reutilizáveis e gerenciamento de estado.
  - **Bootstrap 5**: Estilização e layout responsivo.
  - **HTML**: Estruturação do conteúdo.

- **Back-End**:
  - **Node.js** e **Express**: Gestão das rotas e comunicação com o front-end.
  - **MySQL**: Banco de dados para armazenar informações sobre os livros e a lista de desejos.
  - **Axios**: Utilizado no front-end para realizar requisições HTTP ao back-end.

## Estrutura do Site

### 1. **Aba "Início"**
A aba "Início" contém uma breve descrição do sebo. Esta aba utiliza componentes de **React** e estilização com **Bootstrap**, garantindo uma interface simples e responsiva.

### 2. **Aba "Livros Disponíveis"**
Esta aba exibe todos os livros disponíveis no acervo do sebo. Para implementar essa funcionalidade, foi necessário realizar algumas alterações no banco de dados:

- **Coluna `image`**: Foi adicionada à tabela `books` para armazenar o caminho da imagem de cada livro. As imagens são exibidas dinamicamente na listagem.

A lista de livros é carregada através de uma requisição **GET** ao back-end, utilizando a rota configurada no Express. As informações incluem título, autor, preço e a imagem associada.

### 3. **Aba "Lista de Desejos"**
A aba "Lista de Desejos" permite que os usuários adicionem e gerenciem livros que gostariam de adquirir futuramente. Para implementar essa funcionalidade, foi criada uma nova tabela no banco de dados chamada `wish_list`, com as seguintes colunas:

- **Nome**: Nome do usuário.
- **Email**: E-mail do usuário.
- **Livro**: Nome do livro desejado.
- **Autor**: Autor do livro.
- **Preço**: Preço estimado.
- **Edit**: Coluna adicional usada para controlar a edição dos registros, com valor **1** sendo setado quando a rota **PUT** é utilizada para atualizar um item da lista.

Foram implementadas novas rotas para interagir com essa tabela:

- **GET `/wishList`**: Retorna a lista de desejos.
- **POST `/wishList`**: Adiciona um novo item à lista de desejos.
- **PUT `/updateWishList/:id`**: Atualiza um item da lista de desejos e seta o valor da coluna **edit** para **1**.
- **DELETE `/deleteWishList/:id`**: Remove um item da lista de desejos.

Essas rotas foram desenvolvidas no back-end e atualizadas no repositório do projeto (`tech_challenge2`).

## Configurações do Back-End

### Alterações na Tabela `books`:
- **Coluna `image`**: Adicionada à tabela `books` para armazenar o caminho da imagem associada a cada livro. Isso permite que o front-end exiba as imagens dos livros.

### Tabela `wish_list`:
Criada para armazenar os itens da lista de desejos dos usuários com os seguintes campos:
- **Nome**
- **Email**
- **Livro**
- **Autor**
- **Preço**
- **Edit**: Um campo que registra o valor **1** quando um registro é atualizado via rota **PUT**.

### Rotas do Back-End:
1. **GET `/books`**: Retorna todos os livros disponíveis no acervo.
2. **GET `/wishList`**: Retorna a lista de desejos do usuário.
3. **POST `/wishList`**: Adiciona um novo livro à lista de desejos.
4. **PUT `/updateWishList/:id`**: Atualiza um livro existente na lista de desejos e define o campo `edit` como **1**.
5. **DELETE `/deleteWishList/:id`**: Remove um livro da lista de desejos.

## Como Executar o Projeto

### Front-End
1. Clone o repositório do front-end.
2. Instale as dependências com:
   ```bash
   npm install
2. Execute o projeto com:
   ```bash
   npm start
  
### Back-End
1. Clone o repositório tech_challenge2
2. Instale as dependências com:
   ```bash
   npm install
2. Execute o projeto com:
   ```bash
   npm start
