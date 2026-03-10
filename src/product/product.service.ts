import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    private products: Product[] = [];

    getAllProducts(): Product[] {
        return this.products
    }

    addProduct(createProductDto:CreateProductDto){
        const newProduct: Product = {
            id: Date.now(),
            ...createProductDto
        };
        this.products.push(newProduct);
        return newProduct;
    }

    getProductById(id: number){
        const product = this.products.find((p) => p.id === id)
        if(!product) throw new NotFoundException();
        return product;
    }

    getProductByName(name: string){
        const product = this.products.find((p) => p.name === name)
        if(!product) throw new NotFoundException('Product Not Found!!!');
        return product;
    }

    getProductByBrand(brand: string){
        const product = this.products.find((p) => p.brand === brand)
        if(!product) throw new NotFoundException('Product Not Found!!!');
        return product;
    }

    getProductByCategory(category: string){
        const product = this.products.find((p) => p.category === category)
        if(!product) throw new NotFoundException('Product Not Found!!!');
        return product;
    }

}