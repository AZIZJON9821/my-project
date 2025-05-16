import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'products' })
export class Product extends Model<Product> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    validate: {
      isNumeric: true,
    },
  })
  discount: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
    },
  })
  rating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
    },
  })
  stock: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'available',
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;
}

