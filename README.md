# Supplier Product Management API

![SAP CAP](https://img.shields.io/badge/SAP_CAP-Node.js-blue?logo=sap)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-local-lightgrey?logo=sqlite)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![Fiori Elements](https://img.shields.io/badge/SAP-Fiori_Elements-blue?logo=sap)

A fully functional SAP CAP (Node.js) backend service for managing supplier products with automatic external data enrichment, OData/REST endpoints, input validation, custom actions, and a Fiori Elements UI.

---

## Tech Stack
- SAP CAP (Node.js runtime)
- TypeScript
- SQLite (local persistence)
- SAP Fiori Elements (annotation-driven UI)
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

## Features
- Full CRUD for Suppliers, Products, and ProductReviews via OData/REST
- Automatic external rating enrichment on Product creation
- submitReview action with average rating recalculation
- Server-side input validation with meaningful error messages
- Fiori Elements UI for all 3 entities
- CAP logger for production-ready observability

---

## Fiori Elements UI
Annotation-driven Fiori Elements UI available for all 3 entities.
Access the CAP server index page at http://localhost:4004 and click 'Fiori preview' next to each entity.

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

---

## Sample API Calls

> Base URL: `http://localhost:4004`
> Replace `{{baseUrl}}` with the base URL above when running locally.

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
- dummyjson.com used instead of fakestoreapi.com due to network restrictions (documented above)