import { DataTypes } from "sequelize";
import { AllowNull, AutoIncrement, Column, CreatedAt, Default, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { IOrderDetails, IOrderDetailsCreate } from "../interface/order-details.interface";

@Table({
  tableName: 'order_details',
  timestamps: true,
  paranoid: true,
})
export default class OrderDetails extends Model<IOrderDetails, IOrderDetailsCreate> implements IOrderDetails {

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
  declare order_id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER
  })
  declare no_of_diamonds: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.FLOAT
  })
  declare total_caret: number;

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