# Supplier Product Management API

![SAP CAP](https://img.shields.io/badge/SAP_CAP-Node.js-blue?logo=sap)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-local-lightgrey?logo=sqlite)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)
![License](https://img.shields.io/badge/license-MIT-green)


A fully functional SAP CAP (Node.js) backend service for managing supplier products with automatic external data enrichment.

## Tech Stack
- SAP CAP (Node.js runtime)
- TypeScript
- SQLite (local persistence)
- dummyjson.com (external API)

## Setup & Installation

1. Clone the repository
git clone [your repo URL]
cd supplier-product-api

2. Install dependencies
npm install

3. Deploy database
cds deploy --to sqlite:db/supplier-product.db

4. Start the server
cds watch

Server runs at: http://localhost:4004

## Design Decisions

### TypeScript
Used TypeScript instead of JavaScript for type safety and modern JS practices.

### External API
The task requires fakestoreapi.com but this API is blocked on my network/ISP.
I used dummyjson.com as a replacement — same concept, same implementation pattern.
The category matching and rating extraction logic is identical.

### dummyjson.com vs fakestoreapi.com
- fakestoreapi: rating is nested at `product.rating.rate`
- dummyjson: rating is direct at `product.rating`
Both return product categories for matching.

### Error Handling
External API failures are caught and logged using CAP logger — product creation never fails due to external API issues.

## Sample API Calls

> Base URL: `http://localhost:4004`
> Replace `{{baseUrl}}` with the base URL above when running locally.

### Create a Supplier
POST {{baseUrl}}/odata/v4/catalog/Suppliers
Content-Type: application/json

{
  "name": "Test Supplier",
  "email": "supplier@test.com",
  "rating": 4
}

### Create a Product
POST {{baseUrl}}/odata/v4/catalog/Products
Content-Type: application/json

{
  "name": "Lipstick",
  "price": 19.99,
  "category": "beauty",
  "supplier_ID": "{{supplierID}}"
}

### List all Products
GET {{baseUrl}}/odata/v4/catalog/Products

### List all Suppliers
GET {{baseUrl}}/odata/v4/catalog/Suppliers

### List all Reviews
GET {{baseUrl}}/odata/v4/catalog/ProductReviews

### Submit a Review
POST {{baseUrl}}/odata/v4/catalog/submitReview
Content-Type: application/json

{
  "productID": "{{productID}}",
  "rating": 4,
  "comment": "Good quality"
}

### Validation Error Examples
# Price must be > 0
POST {{baseUrl}}/odata/v4/catalog/Products
Content-Type: application/json

{
  "name": "Invalid Product",
  "price": -1,
  "category": "beauty",
  "supplier_ID": "{{supplierID}}"
}

# Supplier rating must be 1-5
POST {{baseUrl}}/odata/v4/catalog/Suppliers
Content-Type: application/json

{
  "name": "Invalid Supplier",
  "email": "test@test.com",
  "rating": 6
}
## Assumptions
- reviewer field defaults to 'Anonymous' since the action signature doesn't include it
- averageRating is recalculated across all reviews on every submitReview call
- SQLite is used for local development only — no cloud database required