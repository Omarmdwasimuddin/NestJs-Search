## Searching technique

```bash
$ nest g module product
$ nest g service product
$ nest g controller product
```

#### create dto/create-product.dto.ts & interfaces/product.interface.ts

![](/public/Img/product.png)

```bash
# product.interface.ts
export interface Product{
    id: number;
    name: string;
    price: number;
    category: string;
    brand: string;
}
```

```bash
# create-product.dto.ts
export class CreateProductDto{
    name: string;
    price: number;
    category: string;
    brand: string;
}
```

```bash
# product.service.ts
import { Injectable } from '@nestjs/common';
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
}
```

```bash
# product.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
```

![](/public/Img/create.png)
![](/public/Img/read.png)

#### search by id,name,brand & category

```bash
# product.service.ts
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
```

```bash
# product.controller.ts
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
```

![](/public/Img/searchId.png)
![](/public/Img/searchbyname.png)

## searching by any field with query params

```bash
# product.controller.ts
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
```

![](/public/Img/query0.png)
![](/public/Img/query01.png)
![](/public/Img/query.png)