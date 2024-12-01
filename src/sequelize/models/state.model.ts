import { DataTypes } from "sequelize";
import { AutoIncrement, Column, Model, NotNull, PrimaryKey, Table } from "sequelize-typescript";
import { IState } from "../interface";
@Table({
  tableName: "states",
})
export default class State extends Model<IState> {
  @PrimaryKey
  @AutoIncrement
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
