using CatalogService as service from '../../srv/catalog-service';

annotate service.Products with @(
    UI.LineItem: [
        { Value: name, Label: 'Product Name' },
        { Value: category, Label: 'Category' },
        { Value: price, Label: 'Price' },
        { Value: externalRating, Label: 'External Rating' },
        { Value: averageRating, Label: 'Average Rating' }
    ],
    UI.HeaderInfo: {
        TypeName: 'Product',
        TypeNamePlural: 'Products',
        Title: { Value: name }
    },
    UI.FieldGroup #ProductDetails: {
        Label: 'Product Details',
        Data: [
            { Value: name, Label: 'Name' },
            { Value: price, Label: 'Price' },
            { Value: category, Label: 'Category' },
            { Value: externalRating, Label: 'External Rating' },
            { Value: averageRating, Label: 'Average Rating' }
        ]
    },
    UI.Facets: [
        {
            $Type: 'UI.ReferenceFacet',
            Label: 'Product Details',
            Target: '@UI.FieldGroup#ProductDetails'
        }
    ]
);