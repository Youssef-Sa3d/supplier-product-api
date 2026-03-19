using CatalogService as service from '../../srv/catalog-service';

annotate service.Suppliers with @(
    UI.LineItem: [
        { Value: name, Label: 'Supplier Name' },
        { Value: email, Label: 'Email' },
        { Value: rating, Label: 'Rating' }
    ],
    UI.HeaderInfo: {
        TypeName: 'Supplier',
        TypeNamePlural: 'Suppliers',
        Title: { Value: name }
    },
    UI.FieldGroup #SupplierDetails: {
        Label: 'Supplier Details',
        Data: [
            { Value: name, Label: 'Name' },
            { Value: email, Label: 'Email' },
            { Value: rating, Label: 'Rating' }
        ]
    },
    UI.Facets: [
        {
            $Type: 'UI.ReferenceFacet',
            Label: 'Supplier Details',
            Target: '@UI.FieldGroup#SupplierDetails'
        }
    ]
);