# Supplier Product Management API

![SAP CAP](https://img.shields.io/badge/SAP_CAP-Node.js-blue?logo=sap)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-local-lightgrey?logo=sqlite)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![Fiori Elements](https://img.shields.io/badge/SAP-Fiori_Elements-blue?logo=sap)
![Auth](https://img.shields.io/badge/Auth-Basic_Auth-orange)
![BTP](https://img.shields.io/badge/SAP_BTP-Deployed-0FAAFF?logo=sap)

A fully functional SAP CAP (Node.js) backend service for managing supplier products with automatic external data enrichment, OData/REST endpoints, input validation, custom actions, Basic Authentication, and a Fiori Elements UI.

---

## Tech Stack
- SAP CAP (Node.js runtime)
- TypeScript
- SQLite (local persistence)
- SAP Fiori Elements (annotation-driven UI)
- Basic Authentication (CAP built-in)
- dummyjson.com (external API — see Design Decisions)

---

## Setup & Installation

1. Clone the repository
```
git clone https://github.com/Youssef-Sa3d/supplier-product-api.git
cd supplier-product-api
```

2. Install dependencies
```
npm install
```

3. Deploy database
```
cds deploy --to sqlite:db/supplier-product.db
```

4. Start the server
```
cds watch
```

Server runs at: http://localhost:4004

---

## BTP Deployment

This project is deployed on **SAP BTP Cloud Foundry** (trial account).

**Live URL:**
```
https://2d04a4c6trial-dev-supplier-product-api-srv.cfapps.us10-001.hana.ondemand.com
```

**Notes:**
- All API endpoints are served under the `/odata/v4/catalog/` path prefix on BTP (vs `/catalog/` locally)
- The BTP deployment uses SQLite on `/tmp` — data resets on each app restart (ephemeral storage by design for trial)
- Authentication: same Basic Auth credentials (`admin` / `admin123`)
- **⚠️ Trial Expiration**: The SAP BTP trial account, along with this deployment, will automatically expire after 60 days.

## Known BTP Deployment Limitations

The following features work fully in local development but have limitations on the BTP trial deployment:

### TypeScript Handler on BTP
The CAP service handler (`catalog-service.ts`) is written in TypeScript. The BTP Cloud Foundry environment does not compile TypeScript at runtime, causing:
- External API enrichment (`externalRating`) not being populated on product creation
- `submitReview` action returning `501 - no handler found`

All custom logic works correctly when running locally with `cds watch`.

**Root cause:** TypeScript compilation pipeline for CAP on BTP Cloud Foundry requires additional build configuration beyond the scope of this evaluation task.

**Workaround:** Run locally following the setup instructions above for full functionality.

**To redeploy after changes:**
```bash
mbt build
cf deploy mta_archives/supplier-product-api_1.0.0.mtar
```

### BTP Trial Runtime Limitations
The SAP BTP trial account has limited runtime hours per day. The live deployment may be in a stopped state when accessed. 


---

## Authentication
The API is protected with Basic Authentication.

Use the following credentials for local development:
- Username: `admin`
- Password: `admin123`

Use the Basic Auth option in Postman/Bruno or any HTTP client.

---

## Unit Tests

Unit tests were implemented using `@cap-js/cds-test` and `jest` with TypeScript support via `ts-jest`.

### What was tested
- Supplier creation (passing)
- Product creation (passing)
- External API enrichment (skipped — dummyjson.com unreachable in test environment)

### Known Issue
The test environment does not load the TypeScript handler (`catalog-service.ts`) correctly at runtime, causing:
- Validation tests (rating/price checks) to return `201` instead of `400`
- `submitReview` action to return `501 - no handler found`

### What was tried
- Added `"typescript": true` to CDS config
- Configured `ts-jest` with `tsconfig.json`
- Used in-memory SQLite for test isolation

The tests pass for basic CRUD operations. All validations and the `submitReview` action work correctly when tested manually via Postman — the issue is specific to the test environment's TypeScript compilation pipeline.

### Running Tests
```
npm test
```

---

## Features
- Full CRUD for Suppliers, Products, and ProductReviews via OData/REST
- Automatic external rating enrichment on Product creation
- submitReview action with average rating recalculation
- Server-side input validation with meaningful error messages
- Fiori Elements UI for all 3 entities
- Basic Authentication on all endpoints
- CAP logger for production-ready observability

---

## Fiori Elements UI
Annotation-driven Fiori Elements UI available for all 3 entities.
Access the CAP server index page at http://localhost:4004 and click 'Fiori preview' next to each entity.

Note: Use Basic Auth credentials when prompted by the browser.

---

## Design Decisions

### TypeScript
Used TypeScript instead of JavaScript for type safety and modern JS practices.

### External API
The task requires fakestoreapi.com — this API is blocked on my network/ISP.
I used dummyjson.com as a replacement — same concept, same implementation pattern.
- fakestoreapi: rating nested at `product.rating.rate`
- dummyjson: rating direct at `product.rating`
Category matching and rating extraction logic is identical.

### Error Handling
External API failures are caught and logged using CAP logger — product creation never fails due to external API unavailability.

### CAP Logger
Used `cds.log()` instead of `console.log` throughout for production-ready structured logging.

### Authentication
Used CAP built-in Basic Auth to protect all service endpoints. 

---

## Sample API Calls

> **Local Base URL:** `http://localhost:4004`
> **BTP Base URL:** `https://2d04a4c6trial-dev-supplier-product-api-srv.cfapps.us10-001.hana.ondemand.com/odata/v4`
> All requests require Basic Auth — Username: `admin`, Password: `admin123`
>
> ⚠️ On BTP the path prefix is `/odata/v4/catalog/...` — locally it is `/catalog/...`

### Create a Supplier
```
POST {{baseUrl}}/odata/v4/catalog/Suppliers
Content-Type: application/json

{
  "name": "Test Supplier",
  "email": "supplier@test.com",
  "rating": 4
}
```

### Create a Product
```
POST {{baseUrl}}/odata/v4/catalog/Products
Content-Type: application/json

{
  "name": "Lipstick",
  "price": 19.99,
  "category": "beauty",
  "supplier_ID": "{{supplierID}}"
}
```

### List all Products
```
GET {{baseUrl}}/odata/v4/catalog/Products
```

### List all Suppliers
```
GET {{baseUrl}}/odata/v4/catalog/Suppliers
```

### List all Reviews
```
GET {{baseUrl}}/odata/v4/catalog/ProductReviews
```

### Submit a Review
```
POST {{baseUrl}}/odata/v4/catalog/submitReview
Content-Type: application/json

{
  "productID": "{{productID}}",
  "rating": 4,
  "comment": "Good quality"
}
```

### Validation Error Examples
```
# Price must be > 0
POST {{baseUrl}}/odata/v4/catalog/Products
{ "name": "Invalid", "price": -1, "category": "beauty", "supplier_ID": "{{supplierID}}" }

# Supplier rating must be 1-5
POST {{baseUrl}}/odata/v4/catalog/Suppliers
{ "name": "Invalid", "email": "test@test.com", "rating": 6 }

# Review rating must be 1-5
POST {{baseUrl}}/odata/v4/catalog/submitReview
{ "productID": "{{productID}}", "rating": 0, "comment": "test" }
```

---

## Assumptions
- reviewer field defaults to 'Anonymous' since the action signature does not include it
- averageRating is recalculated across all reviews on every submitReview call
- SQLite is used for local development only
- Basic Auth is used for simplicity 
- dummyjson.com used instead of fakestoreapi.com due to network restrictions (documented above)