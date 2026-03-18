# 🧪 Testes de Software - Projeto Reserva-IoT

Este repositório contém a implementação de diferentes níveis de testes aplicados ao ecossistema **Reserva-IoT**, utilizando **Vitest**, **Supertest** e **TypeORM**. O objetivo é garantir a integridade das regras de negócio, a disponibilidade da interface e a conectividade entre os serviços.

## 🚀 Tecnologias Utilizadas
* **Linguagem:** TypeScript
* **Framework de Testes:** Vitest
* **Cobertura de Código:** v8
* **Simulação de API:** Supertest
* **Banco de Dados:** PostgreSQL (Docker)
* **ORM:** TypeORM

## 🏗️ Estrutura dos Testes

Os testes foram organizados seguindo a pirâmide de testes para garantir máxima eficiência e isolamento:

### 1. Testes Unitários (`/src/tests/units`)
Focados na lógica de negócio isolada. Utilizamos **Mocks** para simular o banco de dados e validar regras críticas, como o impedimento de cadastros com e-mails duplicados no `PesquisadorService`.

### 2. Testes de Interface (`/src/tests/units`)
Validam os endpoints da API utilizando **Supertest**. 
- Verificação de disponibilidade via rota `/health`.
- Validação de contratos de dados (Schemas Zod) nas rotas de cadastro.

### 3. Testes de Integração (`/src/tests/integration`)
Verificam a comunicação real entre a aplicação e o banco de dados PostgreSQL rodando em container Docker.

## 📊 Relatório de Cobertura (Coverage)
Alcançamos uma cobertura sólida em camadas críticas de infraestrutura e segurança:
- **Entidades e Erros:** 86% - 100% de cobertura.
- **Banco de Dados:** 100% de cobertura no `appDataSource.ts`.
- **Rotas:** Validação completa dos caminhos de execução.

## 🛠️ Como Rodar os Projetos

### Pré-requisitos
- Docker e Docker Compose instalados.
- Node.js v20+.

### Instalação
1. Clone o repositório.
2. Acesse a pasta `projeto-typescript-aula`.
3. Instale as dependências: `npm install`.

### Execução
1. Suba o banco de dados: `docker compose up -d`.
2. Execute a aplicação: `npm run dev`.
3. Para rodar todos os testes e gerar o relatório: `npm test`.

## ⚠️ Desafios Técnicos Superados
Durante o desenvolvimento, enfrentamos desafios de conectividade e persistência no ambiente Docker (Erro 28P01), solucionados através do gerenciamento de volumes e sincronização de variáveis de ambiente no arquivo `.env`.

---
**Desenvolvido por:** Paulo Victor Rezende Virginio