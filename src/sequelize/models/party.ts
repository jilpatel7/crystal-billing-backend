import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { IParty, IPartyCreate } from "../interface";
import Company from "./company";

@Table({
  tableName: 'parties',
  timestamps: true,
  paranoid: true,
})
export default class Party extends Model<IParty, IPartyCreate> implements IParty {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  declare id: number;

  @AllowNull(false)
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

}  