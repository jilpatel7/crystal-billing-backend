import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import Party from "./party";
import { IPartyAddress, IPartyAddressCreate } from "../interface";

@Table({
  tableName: 'party_addresses',
  timestamps: true,
  paranoid: true,
})
export default class PartyAddress extends Model<IPartyAddress, IPartyAddressCreate> implements IPartyAddress {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  declare id: number;

  @ForeignKey(() => Party)
  @Column({
    type: DataType.INTEGER
  })
  declare party_id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  declare address: string;

  @Column({
    type: DataType.STRING
  })
  declare landmark: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  declare pincode: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;
}