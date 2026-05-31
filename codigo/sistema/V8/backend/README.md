# Backend — HelpHope V8

## Sobre esta Pasta

Esta pasta contém os arquivos responsáveis pela camada de backend do sistema HelpHope.

O backend foi desenvolvido utilizando **Node.js**, **Express.js** e **PostgreSQL**, sendo responsável pelo gerenciamento de dados, autenticação de usuários, controle de permissões e comunicação entre o sistema e o banco de dados.

---

## Arquivos

### server.js

Arquivo principal da aplicação backend.

Responsável por:

* Inicializar o servidor Express;
* Configurar middleware de segurança;
* Gerenciar autenticação JWT;
* Realizar conexão com o banco PostgreSQL;
* Disponibilizar as rotas da API;
* Controlar permissões de usuários;
* Gerenciar pacientes, prontuários, documentos, medicamentos e agendamentos;
* Executar verificações de integridade do sistema.

Tecnologias utilizadas:

* Node.js
* Express.js
* PostgreSQL
* JWT
* Bcrypt
* CORS
* Helmet
* Express Rate Limit

---

### schema.sql

Arquivo responsável pela estrutura do banco de dados.

Contém os comandos SQL utilizados para criar as tabelas e relacionamentos necessários para o funcionamento do sistema.

Principais estruturas:

* Usuários
* Pacientes
* Salas
* Prontuários
* Medicamentos
* Documentos
* Agendamentos
* Aprovações de contas
* Logs do sistema

O arquivo pode ser executado em um servidor PostgreSQL para criar a base de dados utilizada pelo sistema.

---

## Observação

Os arquivos presentes nesta pasta representam a implementação desenvolvida para o backend do projeto.

A configuração da infraestrutura de produção, hospedagem e publicação do banco de dados não faz parte desta entrega acadêmica, sendo disponibilizados apenas os arquivos-fonte necessários para demonstrar a arquitetura e o funcionamento do sistema.

---

## Estrutura

```text
backend/
├── server.js
├── schema.sql
└── README.md
```
