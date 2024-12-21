import { AllowNull, AutoIncrement, BelongsTo, BelongsToMany, Column, CreatedAt, DataType, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { IParty } from "../interface";
import Company from "./company";
import PartyAddress from "./party-address";
import Order from "./order";
import InvoiceHistory from "./invoice-history";

@Table({
  tableName: 'parties',
  timestamps: true,
  paranoid: true,
})
export default class Party extends Model<IParty> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  declare id: number;

  @Column({
    type: DataType.STRING
  })
  declare gstin_no: string;

  @ForeignKey(() => Company)
  @Column({
    type: DataType.INTEGER
  })
  declare company_id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  declare name: string;

  @Column({
    type: DataType.STRING
  })
  declare email: string;

  @Column({
    type: DataType.STRING
  })
  declare personal_phone: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  declare office_phone: string;

  @Column({
    type: DataType.STRING
  })
  declare logo: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  declare price_per_caret: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;

  @BelongsTo(() => Company)
  declare company: Company

  @HasMany(() => PartyAddress)
  declare party_addresses: PartyAddress[];

  @HasMany(() => Order)
  declare orders: Order[];

  @BelongsToMany(() => Company, () => Order, 'party_id', 'company_id')
  declare companies_with_orders: Company[];

  @HasMany(() => InvoiceHistory)
  declare party_invoice_histories: InvoiceHistory[];
}  