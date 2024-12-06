import { DataTypes } from "sequelize";
import { AllowNull, AutoIncrement, BeforeCreate, BeforeValidate, BelongsTo, Column, CreatedAt, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { IOrderDetails, IOrderStatus } from "../interface/order-details.interface";
import Order from "./order";
import Party from "./party";

@Table({
  tableName: 'order_details',
  timestamps: true,
  paranoid: true,
})
export default class OrderDetails extends Model<IOrderDetails> {

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Order)
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
  declare status: IOrderStatus;

  @AllowNull(false)
  @Column({
    type: DataTypes.FLOAT
  })
  declare price_per_caret: number;

  @CreatedAt
  declare created_at: Date;
  @UpdatedAt
  declare updated_at: Date;
  @DeletedAt
  declare deleted_at: Date;

  @BelongsTo(() => Order)
  declare order: Order;

  @BeforeValidate
  static async setDefaultPricePerCaret(orderDetails: OrderDetails) {
    const { order_id } = orderDetails;
    if (!orderDetails.price_per_caret) {
      const order = await Order.findByPk(order_id, {
        include: [{
          model: Party,
          as: 'party',
        }],
      });
      if (order && order.party) {
        orderDetails.price_per_caret = order.party.price_per_caret;
      } else {
        console.log("Party not found for the given order.");
      }
    }
  }
}