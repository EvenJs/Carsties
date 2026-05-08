# 🚗 Carsties — Car Auction Microservices Platform

A full-stack, event-driven microservices application for real-time car auctions, built with .NET, Next.js, and Docker.

---

## 📐 Architecture Overview

```
Client Apps
  ├── WebApp (Next.js)          → Ingress → BFF (Next.js) → Gateway (:6001)
  └── MobileApp (iOS/Android)   → Ingress → BFF (Next.js) → Gateway (:6001)
                                                               │
                    ┌──────────────────────────────────────────┤
                    │                                          │
             identity-svc (:5001)                    auction-svc (:5293)
             (Duende STS, Postgres)                  (Postgres, gRPC :7777)
                                                     search-svc (:5209)
                                                     (MongoDB)
                                                     bid-svc (:7000)
                                                     (MongoDB, gRPC client)
                                                     notify-svc (:7004)
                                                     (SignalR)
                                                           │
                                      ←──── RabbitMQ Event Bus (:5672) ────→
```

All backend services communicate asynchronously via **RabbitMQ** (publish/subscribe). `auction-svc` also exposes a **gRPC endpoint** (`:7777`) consumed by `bid-svc` for auction validation.

---

## 🛠️ Tech Stack

### Backend Services

| Service        | Image                        | Database                   | Port(s)                      |
| -------------- | ---------------------------- | -------------------------- | ---------------------------- |
| `auction-svc`  | `trycatchlearn/auction-svc`  | PostgreSQL (`auctions` db) | `5293` (HTTP), `7777` (gRPC) |
| `search-svc`   | `trycatchlearn/search-svc`   | MongoDB                    | `5209`                       |
| `identity-svc` | `trycatchlearn/identity-svc` | PostgreSQL (`identity` db) | `5001`                       |
| `gateway-svc`  | `trycatchlearn/gateway-svc`  | —                          | `6001`                       |
| `bid-svc`      | `trycatchlearn/bid-svc`      | MongoDB                    | `7000`                       |
| `notify-svc`   | `trycatchlearn/notify-svc`   | — (SignalR)                | `7004`                       |

### Infrastructure

| Service                | Port(s) |
| ---------------------- | ------- |
| PostgreSQL             | `5432`  |
| MongoDB                | `27017` |
| RabbitMQ (AMQP)        | `5672`  |
| RabbitMQ Management UI | `15672` |

### Frontend

- **Next.js 16.2.4** (App Router) — Web client & BFF layer
- **NextAuth** — OIDC authentication against `identity-svc`
- **Tailwind CSS** — Styling

### Infrastructure Stack

- **Docker / Docker Compose** — Container orchestration
- **RabbitMQ + MassTransit** — Async messaging (Event Bus)
- **YARP** — API Gateway / reverse proxy (`gateway-svc`)
- **gRPC** — Synchronous auction data queries from `bid-svc` → `auction-svc`
- **SignalR** — Real-time bid/auction notifications

---

## 📁 Project Structure

```
/
├── src/
│   ├── AuctionService/          # Auction CRUD, EF Core, Postgres, gRPC server
│   ├── SearchService/           # Consumes auction events, MongoDB read model
│   ├── IdentityService/         # Duende IdentityServer (STS + user management)
│   ├── GatewayService/          # YARP reverse proxy / API gateway
│   ├── BiddingService/          # Bid placement, MongoDB, gRPC client
│   └── NotificationService/     # SignalR hub for real-time events
├── frontend/
│   └── web-app/                 # Next.js 15 client (BFF + UI)
├── docker-compose.yml
└── docker-compose.override.yml
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)

### Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/your-username/auctionapp.git
cd auctionapp

# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Tear down (remove containers + volumes)
docker compose down -v
```

### Service URLs

| Service              | URL                    |
| -------------------- | ---------------------- |
| API Gateway          | http://localhost:6001  |
| Identity Server      | http://localhost:5001  |
| Auction Service      | http://localhost:5293  |
| Search Service       | http://localhost:5209  |
| Bidding Service      | http://localhost:7000  |
| Notification Service | http://localhost:7004  |
| RabbitMQ Management  | http://localhost:15672 |

### Run Infrastructure Only (local dev)

```bash
# Spin up just Postgres, MongoDB, and RabbitMQ
docker compose up postgres mongodb rabbitmq -d

# Then run individual services locally
cd src/AuctionService
dotnet run
```

---

## 🔐 Authentication

Authentication is handled by **Duende IdentityServer** (`identity-svc`) acting as an OpenID Connect Security Token Service (STS).

- `identity-svc` uses its own **separate PostgreSQL database** (`identity` db, on the shared Postgres instance)
- The Next.js frontend integrates via **NextAuth** (OIDC)
- JWTs issued by `identity-svc` are validated by all downstream services
- `identity-svc` runs in `Docker` environment mode (uses Docker-specific config/seed data)

---

## 📡 Event-Driven Communication

Services communicate asynchronously via **RabbitMQ** using **MassTransit** as the abstraction layer. All services connect to RabbitMQ at `rabbitmq:5672` and declare health-checked `depends_on` conditions before starting.

Key events:

| Event             | Publisher     | Consumers                  |
| ----------------- | ------------- | -------------------------- |
| `AuctionCreated`  | `auction-svc` | `search-svc`, `bid-svc`    |
| `AuctionUpdated`  | `auction-svc` | `search-svc`               |
| `AuctionDeleted`  | `auction-svc` | `search-svc`, `bid-svc`    |
| `AuctionFinished` | `bid-svc`     | `auction-svc`              |
| `BidPlaced`       | `bid-svc`     | `notify-svc`, `search-svc` |

---

## ⚡ gRPC Communication

`auction-svc` exposes a **gRPC server** on port `7777` (HTTP/2) alongside its regular REST API on port `80` (HTTP/1), configured via Kestrel multi-endpoint setup:

```
Kestrel__Endpoints__Grpc__Protocols = Http2
Kestrel__Endpoints__Grpc__Url       = http://+:7777
Kestrel__Endpoints__WebApi__Url     = http://+:80
```

`bid-svc` uses this gRPC endpoint (`GrpcAuction=http://auction-svc:7777`) to synchronously fetch auction details when processing bids.

---

## 🔔 Real-Time Notifications

`notify-svc` subscribes to bid and auction events on the event bus and broadcasts them to connected browser clients via **SignalR**.

---

## 🩺 Health Checks

All infrastructure services have health checks configured. Application services use `depends_on` with `condition: service_healthy` to ensure correct startup ordering.

| Service    | Health Check                                                 |
| ---------- | ------------------------------------------------------------ |
| `postgres` | `pg_isready -U postgres` (10s interval, 5 retries)           |
| `mongodb`  | `mongosh` ping command (30s start period)                    |
| `rabbitmq` | `rabbitmq-diagnostics check_port_connectivity` (5s interval) |

---

## ⚙️ Key Environment Variables

| Variable                               | Used By                       | Description                         |
| -------------------------------------- | ----------------------------- | ----------------------------------- |
| `RabbitMq__Host`                       | All .NET services             | RabbitMQ hostname (`rabbitmq`)      |
| `ConnectionStrings__DefaultConnection` | `auction-svc`, `identity-svc` | PostgreSQL connection string        |
| `ConnectionStrings__MongoDbConnection` | `search-svc`                  | MongoDB connection string           |
| `ConnectionStrings__BidDbConnection`   | `bid-svc`                     | MongoDB connection string           |
| `IdentityServiceUrl`                   | `auction-svc`, `bid-svc`      | JWT token validation authority      |
| `AuctionServiceUrl`                    | `search-svc`                  | Used to seed search data on startup |
| `GrpcAuction`                          | `bid-svc`                     | gRPC endpoint for `auction-svc`     |

---

## 📄 License

MIT
