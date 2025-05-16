import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import fetch from 'node-fetch';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}
  async create(payload: CreateProductDto, image?: string) {
    const newProduct = await this.productModel.create({
      ...payload,
      image: image ?? null,
    });
    await this.sendTelegramMessage(newProduct);
    return newProduct;
  }
  async findAll(query:{limit?:number;offset?:number}):Promise<Product[]>{
    const {limit=10,offset=0}=query;
    return this.productModel.findAll({limit,offset});
  }
  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    return product;
  }
  async update(id:number,dto:UpdateProductDto,image?:Express.Multer.File):Promise<Product>{
    const product = await this.findOne(id);
    if (image) {
      const oldImagePath = path.join(__dirname, '..', '..', 'uploads', product.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      product.image = image.filename;
    }
    product.name = dto.name ?? product.name;
    product.price = dto.price ?? product.price;
    await product.save();
    return product;
  }
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    const filePath = path.join(__dirname, '..', '..', 'uploads', product.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await product.destroy();
  }
 //QOSHIMCHA BAL UCHUN TELEGRAMGA SEND QOSHIDIM
  private async sendTelegramMessage(product: Product) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = `🆕 Yangi mahsulot yaratildi:\n\n📝 Nomi: ${product.name}\n💰 Narxi: ${product.price}\n🖼 Rasm: ${product.image ? 'uploads/' + product.image : 'yo‘q'}`;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );
    } catch (err) {
      console.error('xabar yuborishda xato:', err.message);
    }
  }
}
