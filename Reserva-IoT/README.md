# Reserva IoT — Frontend Angular

Interface web para monitoramento de reservas florestais com sensores IoT. Construída com **Angular 21**, **Signals**, **Tailwind CSS** e consumindo a API REST do backend.

---

## Início Rápido — Criar usuário (faça isso primeiro)

> O frontend não tem tela de cadastro acessível sem login. Use o **Postman** para criar o primeiro usuário.

### Passo 1 — Suba a API

Antes de rodar o frontend, a API deve estar rodando. No diretório `../projeto-typescript-aula`:

```bash
docker compose up postgres -d
npm install
npm run dev
```

Aguarde: `Server is running in port: 6060`

### Passo 2 — Crie o usuário no Postman

| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `http://localhost:6060/api/register` |
| Body | `raw` → `JSON` |

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minimo8chars",
  "matricula": "MAT001",
  "especialidade": "Biologia",
  "titulacao": "Mestrado",
  "dataNascimento": "1995-05-20"
}
```

**Regras:**
- `senha` — mínimo **8 caracteres**
- `titulacao` — exatamente uma de: `Graduação` | `Especialização` | `Mestrado` | `Doutorado`
- `dataNascimento` — formato `YYYY-MM-DD`
- `email` e `matricula` são únicos
- `linhaPesquisa` é opcional

Resposta `201 Created` — usuário criado com sucesso.

### Passo 3 — Rode o frontend

```bash
npm install
npm start
```

Acesse **`http://localhost:4200`** e faça login com o usuário criado no Postman.

---

## Tecnologias

- Angular 21 com Signals (`signal`, `computed`)
- Reactive Forms
- HttpClient + Interceptors (JWT automático)
- AuthGuard (rotas protegidas)
- Tailwind CSS
- ng-apexcharts (gráficos no dashboard)

---

## Funcionalidades

- **Login / Logout** com refresh token automático (access token expira em 15min, renovado transparentemente)
- **Dashboard** com gráficos de leituras por área
- **CRUD de Áreas** — criar, editar, excluir
- **CRUD de Sensores** — criar, editar, excluir (com status: ativo/inativo/manutenção)
- **CRUD de Pesquisadores** — listar, editar, excluir

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   └── models/         # auth.interceptor.ts, auth.guard.ts
│   ├── features/
│   │   ├── auth/           # login, register
│   │   └── dashboard/      # crud-area, crud-sensor, crud-pesquisador, home
│   ├── layout/
│   │   └── main-layout/    # sidebar + nav
│   └── shared/
│       └── services/       # auth-service, area-service, sensor-service, pesquisador-service
├── environments/
│   └── environment.development.ts   # apiUrl: http://localhost:6060/api
```

---

## Variáveis de Ambiente

O arquivo `src/environments/environment.development.ts`:

```typescript
export const environment = {
  apiUrl: 'http://localhost:6060/api'
};
```

---

## Como funciona a parte IoT — Wokwi alimentando o Dashboard

O dashboard exibe leituras em tempo real enviadas por sensores simulados no **Wokwi**.

### Visão geral do fluxo

```
Wokwi (ESP32 simulado)
        │
        │  HTTP POST /api/leitura
        ▼
  API Backend (Node.js :6060)
        │
        │  salva no PostgreSQL
        ▼
  Frontend Angular (Dashboard)
        │  GET /api/leitura/area/:id
        └─ exibe nos gráficos
```

### Como usar o Wokwi com a API

1. Acesse [wokwi.com](https://wokwi.com) e crie um projeto com **ESP32**.

2. No código do firmware, configure a URL da API:
   ```cpp
   const char* serverUrl = "http://SEU_IP_LOCAL:6060/api/leitura";
   ```
   > Use o IP real da sua máquina (ex: `192.168.0.10`), não `localhost`.

3. O ESP32 envia um `POST` com o payload:
   ```json
   {
     "valorLeitura": 25.4,
     "sensorId": "uuid-do-sensor",
     "areaId": "uuid-da-area"
   }
   ```

4. **Pré-requisito:** Crie a Área e o Sensor no CRUD do frontend antes de iniciar a simulação. Copie os UUIDs gerados e cole no firmware do Wokwi.

### Passo a passo completo para a aula

1. Sobe a API (`docker compose up postgres -d` + `npm run dev`)
2. Cria o usuário no Postman
3. Roda o frontend (`npm start`)
4. Faz login no `http://localhost:4200`
5. Cria uma **Área** e um **Sensor** no dashboard — anota os IDs
6. Cola os IDs no firmware do Wokwi
7. Inicia a simulação no Wokwi — o ESP32 começa a enviar leituras
8. O dashboard atualiza exibindo os dados por área nos gráficos

### Endpoints relevantes para o IoT

| Endpoint | Quem usa | Descrição |
|----------|----------|-----------|
| `POST /api/leitura` | Wokwi (ESP32) | Registrar leitura do sensor |
| `GET /api/leitura/area/:id` | Frontend | Buscar leituras de uma área |
| `GET /api/sensors` | Frontend | Listar sensores cadastrados |
| `GET /api/area` | Frontend | Listar áreas cadastradas |

---

## Simulando envio de dados IoT pelo Postman (sem hardware)

> **Não precisa de autenticação.** O endpoint `/api/leitura` é público — pode ser chamado por qualquer ferramenta ou dispositivo sem token.

Use isso durante a aula para popular o dashboard sem precisar do Wokwi.

### Passo 1 — Busque o ID do sensor

```
GET http://localhost:6060/api/sensors
```

Copie o `id` do sensor que deseja simular.

### Passo 2 — Envie a leitura via Postman

| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `http://localhost:6060/api/leitura` |
| Body | `raw` → `JSON` |
| Auth | **Nenhuma** |

```json
{
  "umidade": 65.5,
  "temperatura": 28.3,
  "sensor_id": "cole-aqui-o-uuid-do-sensor",
  "dataHora": "2024-01-01T10:00:00.000Z"
}
```

**Campos:**
- `umidade` — número entre `0` e `100`
- `temperatura` — número entre `-50` e `100`
- `sensor_id` — UUID do sensor cadastrado (obrigatório)
- `dataHora` — qualquer data ISO válida (o sistema usa a hora atual automaticamente)

Resposta `201 Created`:
```json
{
  "id": "uuid...",
  "umidade": 65.5,
  "temperatura": 28.3,
  "dataHora": "2024-03-11T14:30:00.000Z"
}
```

### Passo 3 — Veja no dashboard

Abra `http://localhost:4200`, faça login e acesse o dashboard. Os dados aparecem nos gráficos da área à qual o sensor pertence.

> Repita o POST com valores variados para ver a evolução nos gráficos.

---

## Rodar em produção (build)

```bash
ng build
```

Os arquivos estarão em `dist/reserva-io-t/browser/`. Sirva com qualquer servidor estático (Nginx, etc).
