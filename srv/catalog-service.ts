import cds from "@sap/cds";

export default class CatalogService extends cds.ApplicationService {


    async init(): Promise<void> {
        const { Products, ProductReviews, Suppliers } = this.entities;


        //Input Validations

        //Product price must be > 0 
        this.before("CREATE", Products, (req: cds.Request) => {
            if (req.data.price <= 0) {
                req.reject(400, "Product price must be greater than 0");
            }
        });

        //ProductReview rating must be between 1 and 5
        this.before("CREATE", ProductReviews, (req: cds.Request) => {
            if (req.data.rating < 1 || req.data.rating > 5) {
                req.reject(400, "ProductReview rating must be between 1 and 5");
            }
        });

        //Supplier rating must be between 1 and 5
        this.before("CREATE", Suppliers, (req: cds.Request) => {
            if (req.data.rating < 1 || req.data.rating > 5) {
                req.reject(400, "Supplier rating must be between 1 and 5");
            }
        });

        //=======================================================================
        //=======================================================================



        //Custom Logic — CAP Event Handlers

        this.before("CREATE", Products, async (req: cds.Request) => {
            try {

                //fakestoreapi not working
                // const response = await fetch("https://fakestoreapi.com/products"); 


                const response = await fetch("https://dummyjson.com/products");
                if (!response.ok) throw new Error("Failed to fetch products from external API");
                const data: any = await response.json();
                const externalProducts: any[] = data.products;


                const match = externalProducts.find((item: any) => item.category.toLowerCase() === req.data.category.toLowerCase());

                if (match) req.data.externalRating = match.rating;



            } catch (error) {
                cds.log("catalog-service").warn("Failed to fetch products from external API", error);
            }

        })


        //=======================================================================
        //=======================================================================


        //Custom Action — submitReview
        this.on("submitReview", async (req: cds.Request) => {
            const { productID, rating, comment } = req.data;

            if (rating < 1 || rating > 5) {
                return req.error(400, 'Review rating must be between 1 and 5')
            }

            //1. Create a new ProductReview record linked to the given productID.
            await INSERT.into(ProductReviews).entries({
                product: { ID: productID },
                rating: rating,
                comment: comment,
                reviewer: 'Anonymous'
            });

            //2. Recalculate the average rating across all reviews for that product.
            const reviews = await SELECT.from(ProductReviews).where({ product: productID });
            const avgRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length;

            //3. Persist the new averageRating value on the Product entity.
            await UPDATE(Products).set({ averageRating: avgRating }).where({ ID: productID });


        })



        await super.init();
    }


}

