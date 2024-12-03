import { AllowNull, AutoIncrement, Column, CreatedAt, Default, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { IOrder, IOrderCreate } from "../interface";
import { DataTypes } from "sequelize";

@Table({
  tableName: 'orders',
  timestamps: true,
  paranoid: true,
})
export default class Order extends Model<IOrder, IOrderCreate> implements IOrder {

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER
  })
  declare party_id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER
  })
  declare company_id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER
  })
  declare no_of_lots: number;

  @Column({
    type: DataTypes.INTEGER
  })
  declare jagad_no: string;

  @Column({
    type: DataTypes.DATE
  })
  declare received_at: Date;

  @Column({
    type: DataTypes.DATE
  })
  declare delivered_at: Date;

  @Column({
    type: DataTypes.INTEGER
  })
  declare delivered_by: number;

  @AllowNull(false)
  @Default('pending')
  @Column({
    type: DataTypes.STRING
  })
  declare status: string;
  @CreatedAt
  declare created_at: Date;
  @UpdatedAt
  declare updated_at: Date;
  @DeletedAt
  declare deleted_at: Date;

}