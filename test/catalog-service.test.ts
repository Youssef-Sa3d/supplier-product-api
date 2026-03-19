import cds from '@sap/cds'

const { GET, POST, DELETE, expect, axios } = cds.test(__dirname + '/..')

axios.defaults.auth = { username: 'admin', password: 'admin123' }

describe('CatalogService', () => {

    // Unit Tests for Supplier

    it('should create a supplier successfully', async () => {
        const { data } = await POST('/odata/v4/catalog/Suppliers', {
            name: 'Test Supplier',
            email: 'test@supplier.com',
            rating: 4
        })
        expect(data.name).to.equal('Test Supplier')
        expect(data.rating).to.equal(4)
    })

    it('should reject supplier with rating above 5', async () => {
        const res = await POST('/odata/v4/catalog/Suppliers', {
            name: 'Invalid Supplier',
            email: 'invalid@test.com',
            rating: 6
        }).catch((e: any) => e.response || e)
        expect(res.status).to.equal(400)
    })

    it('should reject supplier with rating below 1', async () => {
        const res = await POST('/odata/v4/catalog/Suppliers', {
            name: 'Invalid Supplier',
            email: 'invalid@test.com',
            rating: 0
        }).catch((e: any) => e.response || e)
        expect(res.status).to.equal(400)
    })

    //===================================================================
    //===================================================================

    // Unit Tests for Product

    it('should reject product with price below or equal to 0', async () => {
        const res = await POST('/odata/v4/catalog/Products', {
            name: 'Invalid Product',
            price: -1,
            category: 'beauty'
        }).catch((e: any) => e.response || e)
        expect(res.status).to.equal(400)
    })

    it('should create a product successfully', async () => {
        const { data: supplier } = await POST('/odata/v4/catalog/Suppliers', {
            name: 'Supplier for Product Test',
            email: 'supplier@test.com',
            rating: 3
        })

        const { data } = await POST('/odata/v4/catalog/Products', {
            name: 'Test Product',
            price: 29.99,
            category: 'beauty',
            supplier_ID: supplier.ID
        })
        expect(data.name).to.equal('Test Product')
        expect(data.price).to.equal(29.99)
    })

    it.skip('should enrich product with externalRating on creation - skipped: external API unreachable in test environment', async () => {
        // This test is skipped because dummyjson.com is unreachable in the test environment
        // The external API integration is tested manually via Postman
        // fakestoreapi.com (required by task) is also blocked on this network
    })

    //===================================================================
    //===================================================================

    // Unit Tests for Review

    it('should reject review with rating below 1', async () => {
        const res = await POST('/odata/v4/catalog/submitReview', {
            productID: '00000000-0000-0000-0000-000000000000',
            rating: 0,
            comment: 'Bad rating'
        }).catch((e: any) => e.response || e)
        expect(res.status).to.equal(400)
    })

    it('should reject review with rating above 5', async () => {
        const res = await POST('/odata/v4/catalog/submitReview', {
            productID: '00000000-0000-0000-0000-000000000000',
            rating: 6,
            comment: 'Bad rating'
        }).catch((e: any) => e.response || e)
        expect(res.status).to.equal(400)
    })

    it('should submit a review and update averageRating', async () => {
        const { data: supplier } = await POST('/odata/v4/catalog/Suppliers', {
            name: 'Review Test Supplier',
            email: 'review@test.com',
            rating: 4
        })

        const { data: product } = await POST('/odata/v4/catalog/Products', {
            name: 'Review Test Product',
            price: 49.99,
            category: 'beauty',
            supplier_ID: supplier.ID
        })

        await POST('/odata/v4/catalog/submitReview', {
            productID: product.ID,
            rating: 4,
            comment: 'Great product!'
        })

        const { data: updatedProduct } = await GET(
            `/odata/v4/catalog/Products(${product.ID})`
        )
        expect(updatedProduct.averageRating).to.equal(4)
    })

})