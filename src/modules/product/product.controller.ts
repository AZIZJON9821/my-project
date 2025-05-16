import {Controller,Post,Get,Put,Delete,Param,Body,UseInterceptors,UploadedFile,ParseIntPipe,Query,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { extname } from 'path';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Protected, Roles } from 'src/modules/decorator';
import { UserRoles } from '../enums';
import { Product } from 'src/modules/models/product.model';
import { InjectModel } from '@nestjs/sequelize';

@ApiBearerAuth() 
@Controller('products')
@Protected(true)
@Roles([UserRoles.ADMIN,UserRoles.USER])
export class ProductController {
  constructor(private readonly productService: ProductService
,@InjectModel(Product) private readonly productModel: typeof Product,
    
  ) {}
      async onModuleInit() {
    await this.#_seedProduct();
  }
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() payload: CreateProductDto,
  ) {
    return this.productService.create(payload, image?.filename);
  }
@Get()
findAll(
  @Query('page') page: number,
  @Query('limit') limit: number,
) {
  return this.productService.findAll({  limit,  offset: (page - 1) * limit });
}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productService.update(id, dto, image);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
async #_seedProduct() {
const sampleProducts = [
  { name: 'car1', price: 649.99, image: 'img1.jpg', status: 'available', stock: 12, discount: 10, rating: 4.7 },
  { name: 'car2', price: 129.99, image: 'img2.jpg', status: 'available', stock: 45, discount: 5, rating: 4.5 },
  { name: 'car3', price: 1299.99, image: 'img3.jpg', status: 'available', stock: 8, discount: 15, rating: 4.8 },
  { name: 'car4', price: 799.99, image: 'img4.jpg', status: 'available', stock: 23, discount: 8, rating: 4.6 },
  { name: 'car5', price: 89.99, image: 'img5.jpg', status: 'available', stock: 34, discount: 0, rating: 4.3 },
  { name: 'car6', price: 399.99, image: 'img6.jpg', status: 'available', stock: 16, discount: 12, rating: 4.4 },
  { name: 'car7', price: 59.99, image: 'img7.jpg', status: 'available', stock: 56, discount: 5, rating: 4.2 },
  { name: 'car8', price: 349.99, image: 'img8.jpg', status: 'available', stock: 18, discount: 7, rating: 4.5 },
  { name: 'car9', price: 179.99, image: 'img9.jpg', status: 'available', stock: 29, discount: 0, rating: 4.1 },
  { name: 'car10', price: 49.99, image: 'img10.jpg', status: 'available', stock: 42, discount: 0, rating: 4.0 },
  { name: 'car11', price: 299.99, image: 'img11.jpg', status: 'available', stock: 14, discount: 10, rating: 4.6 },
  { name: 'car12', price: 79.99, image: 'img12.jpg', status: 'available', stock: 37, discount: 5, rating: 4.4 },
  { name: 'car13', price: 49.99, image: 'img13.jpg', status: 'available', stock: 31, discount: 0, rating: 4.2 },
  ]
  for (let product of sampleProducts) {
    const existingProduct = await this.productModel.findOne({ where: { name: product.name } });
    if (!existingProduct) {
      await this.productModel.create(product);
    }
  }
    console.log("Productlar yaratildi");
  }
}
