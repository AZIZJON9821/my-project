import { ParseFilePipe } from './pipes/parse-file.pipe';
import { Controller, Post, Body, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, RegisterDto } from './dtos';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Protected, Roles } from 'src/modules/decorator';
import { UserRoles } from './enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize'; 

@Controller('auth')
export class AuthController {
constructor(
  private readonly authService: AuthService,
  @InjectModel(User) private readonly userModel: typeof User,
) {}
    async onModuleInit() {
    await this.#_seedUsers();
  }
  @Post('Register')
  @Protected(false)
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  async createUser(@Body() userData: RegisterDto) {
    return await this.authService.register(userData);
  }
  @Post('Login')
  @Protected(false)
  @Roles([UserRoles.USER, UserRoles.ADMIN])
  async authenticateUser(@Body() credentials: LoginDto) {
    return await this.authService.login(credentials);
  }
  
@ApiOperation({ summary: 'testiviy user yaratish' })
@Post("User")
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  }),
)
@ApiConsumes('multipart/form-data')
create(
  @UploadedFile(new ParseFilePipe(['image/png', 'image/jpeg'], 2 * 1024 * 1024))
  image: Express.Multer.File,
  @Body() payload: CreateUserDto,
) {
  return this.authService.create(payload, image?.filename);
}

@ApiBearerAuth()
@Protected(true)
@Roles([UserRoles.ADMIN, ])
@Get()
@Protected(true)
@Roles([UserRoles.ADMIN])
async getAllUsers() {
  return await this.userModel.findAll();
}




async #_seedUsers() {
    const users = [
      {
        name: 'az',
        email: 'az@gmail.com',
        password: 'az123',
        role: UserRoles.ADMIN,
      },
    ];
    for (let u of users) {
      const user = await this.userModel.findOne({ where: { email: u.email } });
      if (!user) {
        const passwordHash = bcrypt.hashSync(u.password);
        await this.userModel.create({
          name: u.name,
          email: u.email,
          password: passwordHash,
          role: u.role,
        });
      }
    }
    console.log("User yaratildi");
  }
  


}