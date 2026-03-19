using { supplier.product as db } from '../db/schema';
@requires: 'authenticated-user'



service CatalogService {
    //entity {} as projection on db.Entity; automatically generates all 4 CRUD operations

    entity Suppliers as projection on db.Supplier;
    entity Products as projection on db.Product;
    entity ProductReviews as projection on db.ProductReview;

    //action {} is used to define custom operations
    action submitReview(productID: UUID, rating: Integer, comment: String);
    
}