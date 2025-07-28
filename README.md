# Frontend Angular - Módulo de Gestão de Documentos

![Angular](https://img.shields.io/badge/Angular-20-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![SCSS](https://img.shields.io/badge/SCSS-pink.svg)
![Angular Material](https://img.shields.io/badge/Angular_Material-purple.svg)

## Descrição do Projeto

Esta é a Single-Page Application (SPA) que serve como interface de usuário para o Módulo de Gestão de Documentos da ZapSign. [cite_start]A aplicação foi construída com **Angular** [cite: 32] e focada em uma experiência de usuário fluida e reativa, permitindo o gerenciamento completo do ciclo de vida de documentos e signatários.

### Principais Features

* **Autenticação Segura:** Login com JWT e tratamento automático de tokens expirados.
* **Gerenciamento de Entidades:** CRUD completo para Empresas, Documentos e Signatários.
* [cite_start]**Interface Reativa:** Construída com componentes `standalone` e estado gerenciado por **Angular Signals**, a interface atualiza dinamicamente sem a necessidade de recarregar a página[cite: 23, 90].
* **Integração com Assinaturas:** Funcionalidade para gerar o link de assinatura único da ZapSign para cada signatário.
* **Insights em Tempo Real:** Visualização da análise de IA, com o texto sendo exibido token por token em tempo real através de uma conexão **Server-Sent Events (SSE)**.

## Arquitetura e Padrões

* **Componentes Standalone:** Utiliza a arquitetura moderna do Angular para componentes mais modulares e independentes.
* **Estado Reativo com Signals:** A gestão de estado é centralizada em serviços que utilizam `Signals` para uma reatividade granular e performática.
* **Componentes de UI:** A interface utiliza a biblioteca **Angular Material** para garantir consistência visual e acelerar o desenvolvimento.

## Como Executar o Projeto (Desenvolvimento Local)

### Pré-requisitos
* Node.js (v20+)
* Angular CLI (`npm install -g @angular/cli`)
* A API do Backend (`backend/`) deve estar em execução.

### Instalação
Navegue até a raiz do projeto frontend e instale as dependências:
```bash
npm install
```

### Executando
Para iniciar o servidor de desenvolvimento, execute:
```bash
npm start
```
A aplicação estará disponível em **`http://localhost:4200`**.

O projeto utiliza um proxy (`proxy.conf.json`) para redirecionar as chamadas de `/api` para o backend rodando em `http://localhost:8000`, evitando problemas de CORS.
