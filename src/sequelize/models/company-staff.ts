import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { ICompanyStaff, ICompanyStaffCreate } from "../interface";
import Company from "./company";
import { DataTypes } from "sequelize";

@Table({
  tableName: 'company_staffs',
  timestamps: true,
  paranoid: true,
})
export default class CompanyStaff extends Model<ICompanyStaff, ICompanyStaffCreate> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER
  })
  declare id: number;

  @ForeignKey(() => Company)
  @Column({
    type: DataTypes.INTEGER
  })
  declare company_id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING
  })
  declare first_name: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING
  })
  declare last_name: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
    allowNull: false
  })
  declare gender: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false
  })
  declare age: number;

  @Column({
    type: DataTypes.STRING
  })
  declare primary_phone: string;

  @Column({
    type: DataTypes.STRING
  })
  declare secondary_phone: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.TEXT
  })
  declare address: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;


  @BelongsTo(() => Company)
  declare company: Company;
}