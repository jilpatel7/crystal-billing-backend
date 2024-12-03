import { AllowNull, AutoIncrement, Column, CreatedAt, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { ICompany, ICompanyCreate } from "../interface";
import { DataTypes } from "sequelize";

@Table({
  tableName: 'companies',
  timestamps: true,
  paranoid: true,
})
export default class Company extends Model<ICompany, ICompanyCreate> implements ICompany {
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
}
