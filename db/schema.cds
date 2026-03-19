using { cuid } from '@sap/cds/common';
namespace supplier.product;

entity Supplier : cuid {
    name : String;
    email : String;
    rating : Integer;
}

entity Product : cuid {
    name : String;
    price : Decimal(10,2);
    category : String;
    externalRating : Decimal(3,2);
    averageRating : Decimal(3,2);
    supplier : Association to Supplier;
}

entity ProductReview : cuid {
    product      : Association to Product;
    rating       : Integer;
    comment      : String;
    reviewer     : String;
}