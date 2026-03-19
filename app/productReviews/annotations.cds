using CatalogService as service from '../../srv/catalog-service';

annotate service.ProductReviews with @(
    UI.LineItem: [
        { Value: product_ID, Label: 'Product' },
        { Value: reviewer, Label: 'Reviewer' },
        { Value: rating, Label: 'Rating' },
        { Value: comment, Label: 'Comment' }
    ],
    UI.HeaderInfo: {
        TypeName: 'Review',
        TypeNamePlural: 'Reviews',
        Title: { Value: reviewer }
    },
    UI.FieldGroup #ReviewDetails: {
        Label: 'Review Details',
        Data: [
            { Value: product_ID, Label: 'Product' },
            { Value: reviewer, Label: 'Reviewer' },
            { Value: rating, Label: 'Rating' },
            { Value: comment, Label: 'Comment' }
        ]
    },
    UI.Facets: [
        {
            $Type: 'UI.ReferenceFacet',
            Label: 'Review Details',
            Target: '@UI.FieldGroup#ReviewDetails'
        }
    ]
);