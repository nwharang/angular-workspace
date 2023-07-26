import { Context } from "~server/Utils/trpc.utils";


export default class ProductController {
    async getProducts(ctx: Context) {
        const products = await ctx.prisma.product.findMany();
        return products;
    }
    
    async getProductById(ctx: Context, input: { id: string }) {
        const product = await ctx.prisma.product.findUnique({
            where: {
                id: input.id
            }
        });
        return product;
    }
    
}