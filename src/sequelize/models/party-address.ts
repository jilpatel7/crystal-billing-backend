import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import Party from "./party";
import { IPartyAddress } from "../interface";
import { DataTypes } from "sequelize";

@Table({
  tableName: 'party_addresses',
  timestamps: true,
  paranoid: true,
})
export default class PartyAddress extends Model<IPartyAddress> {
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
    type: DataTypes.STRING
  })
  declare address: string;

  @Column({
    type: DataTypes.STRING
  })
  declare landmark: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING
  })
  declare pincode: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;


  @BelongsTo(() => Party)
  declare party: Party;
}