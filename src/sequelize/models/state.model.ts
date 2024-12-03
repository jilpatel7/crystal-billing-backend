import { DataTypes } from "sequelize";
import { AllowNull, AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IState } from "../interface";
@Table({
  tableName: "states",
})
export default class State extends Model<IState> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare state: number;

}
