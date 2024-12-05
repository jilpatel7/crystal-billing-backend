import { AllowNull, AutoIncrement, BelongsTo, BelongsToMany, Column, CreatedAt, DeletedAt, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { ICompany } from "../interface";
import { DataTypes } from "sequelize";
import Party from "./party";
import CompanyStaff from "./company-staff";
import Order from "./order";

@Table({
  tableName: 'companies',
  timestamps: true,
  paranoid: true,
})
export default class Company extends Model<ICompany> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
  })
  declare id: number;


  @AllowNull(false)
  @Column({
    type: DataTypes.STRING
  })
  declare gstin_no: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING
  })
  declare email: string;

  @Column({
    type: DataTypes.STRING
  })
  declare password: string;

  @Column({
    type: DataTypes.STRING
  })
  declare personal_phone: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING
  })
  declare office_phone: string;

  @Column({
    type: DataTypes.STRING
  })
  declare otp: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;


  @HasMany(() => Party)
  declare parties: Party[];

  @HasMany(() => CompanyStaff)
  declare company_staffs: CompanyStaff[];

  @HasMany(() => Order)
  declare orders: Order[];

  @BelongsToMany(() => Party, () => Order, 'company_id', 'party_id')
  declare parties_with_orders: Party[];
}
