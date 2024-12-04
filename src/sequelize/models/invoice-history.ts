import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { IInvoiceHistory, IInvoiceHistoryCreate } from "../interface/invoice-history.interface";
import { DataTypes } from "sequelize";
import Party from "./party";

@Table({
  tableName: 'invoice-history',
  timestamps: true,
  paranoid: true,
})
export default class InvoiceHistory extends Model<IInvoiceHistory, IInvoiceHistoryCreate> implements IInvoiceHistory {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER
  })
  declare id: number;

  @ForeignKey(() => Party)
  @Column({
    type: DataTypes.INTEGER
  })
  declare party_id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.DATE
  })
  declare start_date: Date;

  @AllowNull(false)
  @Column({
    type: DataTypes.DATE
  })
  declare end_date: Date;

  @AllowNull(false)
  @Column({
    type: DataTypes.FLOAT
  })
  declare total_amount: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.FLOAT,
    defaultValue: 0
  })
  declare paid_amount: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;

  @BelongsTo(() => Party)
  declare party: Party;
}