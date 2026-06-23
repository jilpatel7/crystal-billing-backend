import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { IStaffAttendance } from '../interface/staff-attendance.interface';
import { DataTypes } from 'sequelize';
import CompanyStaff from './company-staff';

@Table({
  tableName: 'staff_attendance',
  timestamps: true,
  paranoid: true,
})
export default class StaffAttendance extends Model<IStaffAttendance> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => CompanyStaff)
  @Column({
    type: DataTypes.INTEGER,
  })
  declare staff_id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
  })
  declare status: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.DATE,
  })
  declare attendance_date: Date;

  @AllowNull(true)
  @Column({
    type: DataTypes.TEXT,
  })
  declare reason: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;

  @BelongsTo(() => CompanyStaff)
  declare staff: CompanyStaff;
}
