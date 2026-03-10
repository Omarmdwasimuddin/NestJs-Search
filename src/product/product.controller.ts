import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

    @Get(':id')
    getProductById(@Param('id') id: string){
        return this.productService.getProductById(Number(id));
    }

    // @Get(':name')
    // getProductByName(@Param('name') name: string){
    //     return this.productService.getProductByName(name);
    // }

    @Get('name/:name')
    getProductByName(@Param('name') name: string){
        return this.productService.getProductByName(name);
    } 

    // @Get(':brand')
    // getProductByBrand(@Param('brand') brand: string){
    //     return this.productService.getProductByBrand(brand);
    // }

    @Get('brand/:brand')
    getProductByBrand(@Param('brand') brand: string){
        return this.productService.getProductByBrand(brand);
    }

    @Get('category/:category')
    getProductByCategory(@Param('category') category: string){
        return this.productService.getProductByCategory(category);
    }
}