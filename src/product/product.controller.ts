import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @Get()
    getAllProducts(){
        return this.productService.getAllProducts();
    }

    @Post()
    addProduct(@Body() createProductDto: CreateProductDto){
        return this.productService.addProduct(createProductDto);
    }

    @Get('search')
    searchProduct(
        @Query('id') id?: string,
        @Query('name') name?: string,
        @Query('brand') brand?: string,
        @Query('category') category?: string,
    ){
        if(id) return this.productService.getProductById(Number(id));
        if(name) return this.productService.getProductByName(name);
        if(brand) return this.productService.getProductByBrand(brand);
        if(category) return this.productService.getProductByCategory(category);
        return this.productService.getAllProducts();
    }
}