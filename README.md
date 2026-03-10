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

## Partial searching with Like, ILike

ILike সাধারণত ব্যবহার করা হয় database query করার সময় (বিশেষ করে PostgreSQL + TypeORM এ)।
এটা case-insensitive partial search দেয়। যেমন Arman লিখলে arman ali ও match করবে।

NestJS এ ILike ব্যবহার করতে হলে কিছু setup দরকার।

---

#### প্রয়োজনীয় package install

যদি তুমি TypeORM + PostgreSQL ব্যবহার করো তাহলে install করতে হবে:

```bash
npm install @nestjs/typeorm typeorm pg
```

Explanation:

- @nestjs/typeorm → NestJS এর সাথে TypeORM connect করার জন্য
- typeorm → ORM library
- pg → PostgreSQL driver

---

#### Database Module Setup

`app.module.ts`

```ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'product_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

---

#### Entity Create

`product.entity.ts`

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  category: string;

  @Column()
  price: number;

}
```

---

#### Module এ Entity Import

`product.module.ts`

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
```

---

#### Service এ Repository Inject

```ts
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}
```

---

#### ILike দিয়ে Partial Search

```ts
getProductByName(name: string) {
  return this.productRepo.find({
    where: {
      name: ILike(`%${name}%`)
    }
  });
}
```

Explanation:

%${name}%

মানে

%arman%

SQL Query হবে:

```
SELECT * FROM product
WHERE name ILIKE '%arman%'
```

Result:

| name           |
| -------------- |
| Arman          |
| Arman Ali      |
| Mohammad Arman |

সবই match করবে।

---

##### Brand Search

```ts
getProductByBrand(brand: string) {
  return this.productRepo.find({
    where: {
      brand: ILike(`%${brand}%`)
    }
  });
}
```

---

##### API Example

```
http://localhost:3000/products/search?name=arman
```

Result:

```
Arman
Arman Ali
```

---

#### Important

তুমি যেহেতু আগে Prisma ব্যবহার করো (তোমার projects এ), Prisma তে ILike নেই।
Prisma তে partial search হয়:

```
contains
mode: 'insensitive'
```

Example:

```ts
where: {
  name: {
    contains: "arman",
    mode: "insensitive"
  }
}
```

---