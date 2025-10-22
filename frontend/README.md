# Decentralized Land Verification System - Hackathon MVP

## Overview

This project is a prototype for a **decentralized land verification system** designed to bring **trust, transparency, and verifiability** to land ownership processes - starting with **Buganda (Central Uganda)** as the pilot region.

Our system combines a **React Native frontend** with an **Express + Postgres backend**, and later scales to a **fully on-chain model** using **Merkle proofs and zero-knowledge verification**. This MVP demonstrates how land credentials, authorities, and verification logic can transition from traditional databases to verifiable, decentralized infrastructure.

---

## Vision

Current land ownership systems rely on fragmented paper trails and unverified digital records.
Our solution introduces a **progressive decentralization approach**:

1. **Start off-chain** for usability and rapid prototyping.
2. **Introduce verifiable registries** for authorities and credentials.
3. **Integrate on-chain proof anchoring** using zk-SNARKs and Merkle commitments.

Ultimately, this creates a **trustless proof of land authenticity** - usable by governments, banks, and individuals alike.

---

## Architecture

**Stack Overview**

* **Frontend:** React Native (Expo)
* **Backend:** Express.js + PostgreSQL
* **Containerization:** Docker Compose
* **Blockchain (Future Phase):** zk-SNARK-based proof verification and on-chain schema anchors

**Key Modules**

1. **Schema Registry** - Defines JSON schemas for credential types (e.g., “Buganda Land Title”)
2. **Authority Registry** - Lists trusted signers (chiefs, registrars, surveyors)
3. **zk Proof Fallback** - Provides a lightweight proof-verification fallback or mock verifier
4. **Event Mirroring (Demo)** - Mimics blockchain verification events for visual dashboards

---

## Backend Design

The backend is minimal yet production-aligned:

* Built with **Express.js** (TypeScript or ES Modules)
* Stores schemas, authorities, and proof requests in **PostgreSQL**
* Ready for **containerized deployment** via Docker Compose
* Enables **CORS** for seamless mobile interaction

**Endpoints**

| Route          | Method | Description                                     |
| -------------- | ------ | ----------------------------------------------- |
| `/schemas`     | GET    | Fetch all schemas                               |
| `/schemas/:id` | GET    | Fetch a schema by ID                            |
| `/schemas`     | POST   | Add a new credential schema                     |
| `/authorities` | GET    | List all registered authorities                 |
| `/authorities` | POST   | Add a new authority                             |
| `/verify`      | POST   | Submit a proof (mock verification)              |
| `/events`      | GET    | Retrieve historical or mock verification events |

**Database Tables**

* `schemas` - stores land credential types
* `authorities` - stores signer and jurisdiction data
* `proof_requests` - logs verification attempts and outcomes
* `events` - stores blockchain-mirrored or mock event data

---

## Frontend Integration

The frontend communicates with the backend via REST:

* Loads credential schemas for land registration
* Displays available verification authorities
* Submits zk proofs or fallback verification requests
* Displays event/verification history

Future versions will integrate **on-chain verification modules** directly through smart contracts.

---

## Deployment

**Local setup:**

```bash
docker-compose up --build
```

This launches both:

* PostgreSQL at port **5432**
* Express backend at port **8080**

**Configuration:**
Environment variables are defined in `.env`:

```
DATABASE_URL=postgres://landapp:password@db:5432/landdb
PORT=8080
```

---

## Future Extensions (Post-Hackathon)

1. **On-chain schema anchoring** - store schema hashes on Ethereum/Optimism
2. **zk-SNARK verification** - offload or parallelize proof generation (device or backend)
3. **Proof persistence** - persist proof commitments and event logs on-chain
4. **Multi-authority federation** - verifiable multi-signature credentials
5. **Public dashboard** - open explorer for verified land credentials

---

## Why This Matters

Land verification touches the foundation of wealth, rights, and trust in many regions.
This MVP demonstrates how a **verifiable, decentralized identity and land record system** can be both **accessible** and **trustless**, paving the way for a new era of digital property assurance.

**"From land documents to verifiable proofs - transparency, from the ground up."**
