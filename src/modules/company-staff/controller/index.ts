import { Request, Response } from 'express';
import generalResponse from '../../../helper';
import { COMPANY_STAFF_RESPONSE } from '../enum';
import _ from 'lodash';
import { removeKeys } from '../../../utils';
import CompanyStaff from '../../../sequelize/models/company-staff';
import { Op } from 'sequelize';
import StaffAttendance from '../../../sequelize/models/staff-attendance';

export const createCompanyStaff = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { address, age, first_name, gender, last_name, primary_phone, secondary_phone } =
      req.body;
    const result = await CompanyStaff.create({
      address,
      age,
      first_name,
      gender,
      last_name,
      primary_phone,
      secondary_phone,
      company_id,
    });
    const data = result.toJSON();
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_CREATED,
      response: res,
      data: removeKeys(data, ['company_id', 'created_at', 'updated_at']),
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const updateCompanyStaff = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { id, address, age, first_name, gender, last_name, primary_phone, secondary_phone } =
      req.body;
    const staff = await CompanyStaff.findByPk(id);
    if (!staff) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    const result = await CompanyStaff.update(
      {
        address,
        age,
        first_name,
        gender,
        last_name,
        primary_phone,
        secondary_phone,
      },
      {
        where: {
          id,
          company_id,
        },
      }
    );

    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_UPDATED,
      response: res,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const deleteCompanyStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const party = await CompanyStaff.findByPk(id);
    if (!party) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    const result = await CompanyStaff.destroy({
      where: { id },
    });
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_DELETED,
      response: res,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const getCompanyStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const party = await CompanyStaff.findByPk(Number(id));
    if (!party) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FETCH_SUCCESS,
      response: res,
      data: party,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const getAllCompanyStaff = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    let { sort = 'id', order = 'DESC', page = 1, limit = 10, search = '' } = req.query;

    page = +page;
    limit = +limit;

    const offset = (page - 1) * limit;

    const staff = await CompanyStaff.findAndCountAll({
      attributes: [
        'id',
        'address',
        'age',
        'first_name',
        'gender',
        'last_name',
        'primary_phone',
        'secondary_phone',
        'created_at',
        'updated_at',
      ],
      where: {
        company_id,
        [Op.or]: [
          { last_name: { [Op.like]: `%${(search as string).toLowerCase()}%` } },
          { first_name: { [Op.like]: `%${(search as string).toLowerCase()}%` } },
        ],
      },
      order: [[sort as string, order as 'ASC' | 'DESC']],
      limit: limit,
      offset: offset,
    });

    const responseData = {
      totalRecords: staff.count, // Total number of records
      totalPages: Math.ceil(staff.count / limit), // Total pages
      currentPage: page, // Current page
      data: staff.rows, // Paginated data
    };

    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FETCH_SUCCESS,
      response: res,
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const getAllCompanyStaffIdsAndNames = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const staff = await CompanyStaff.findAll({
      attributes: ['id', 'first_name', 'last_name'],
      where: {
        company_id,
      },
    });

    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FETCH_SUCCESS,
      response: res,
      data: staff,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const markStaffAttendance = async (req: Request, res: Response) => {
  try {
    const { staff_id, status, attendance_date, reason } = req.body;
    const staff = await CompanyStaff.findByPk(staff_id);
    if (!staff) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    const attendanceOnDate = await StaffAttendance.findOne({
      where: {
        staff_id: staff_id,
        attendance_date: attendance_date,
      },
    });

    if (attendanceOnDate) {
      const updatedResult = await StaffAttendance.update(
        {
          status,
          reason,
        },
        {
          where: {
            id: attendanceOnDate.id,
          },
        }
      );
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_ATTENDANCE_MARKED,
        response: res,
        data: updatedResult,
      });
    } else {
      const result = await StaffAttendance.create({
        staff_id: staff_id,
        status,
        attendance_date,
        reason,
      });
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_ATTENDANCE_MARKED,
        response: res,
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const getStaffAttendance = async (req: Request, res: Response) => {
  try {
    const { staff_id, month } = req.query;
    const staff = await CompanyStaff.findByPk(Number(staff_id));
    if (!staff) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    const attendance = await StaffAttendance.findAll({
      where: {
        staff_id: Number(staff_id),
        attendance_date: {
          [Op.gte]: new Date(`${month}-01`),
          [Op.lte]: new Date(`${month}-31`),
        },
      },
      order: [['attendance_date', 'ASC']],
    });

    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_ATTENDANCE_FETCHED,
      response: res,
      data: attendance,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const getStaffAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const { staff_id, month, year } = req.query;
    const staff = await CompanyStaff.findByPk(Number(staff_id));
    if (!staff) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    const attendance = await StaffAttendance.findAll({
      where: {
        staff_id: Number(staff_id),
        attendance_date: {
          [Op.gte]: new Date(`${year}-${month}-01`),
          [Op.lte]: new Date(`${year}-${month}-31`),
        },
      },
      order: [['attendance_date', 'ASC']],
    });

    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_ATTENDANCE_FETCHED,
      response: res,
      data: {
        totalDays: attendance.length,
        presentDays: attendance.filter((attendance) => attendance.status === 'present').length,
        absentDays: attendance.filter((attendance) => attendance.status === 'absent').length,
        attendancePercentage: (attendance.length / 31) * 100,
        halfDays: attendance.filter((attendance) => attendance.status === 'half-day').length,
      },
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const markStaffLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { staff_id, start_date, end_date, reason, status } = req.body;
    const staff = await CompanyStaff.findByPk(staff_id);
    if (!staff) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    const attendanceOnDate = await StaffAttendance.findAll({
      where: {
        staff_id: staff_id,
        attendance_date: {
          [Op.gte]: start_date,
          [Op.lte]: end_date,
        },
      },
      order: [['attendance_date', 'ASC']],
    });

    if (attendanceOnDate.length > 0) {
      const updatedResult = await StaffAttendance.update(
        {
          status: status,
          reason,
        },
        {
          where: {
            id: {
              [Op.in]: attendanceOnDate.map((attendance) => attendance.id),
            },
          },
        }
      );
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_LEAVE_REQUEST_CREATED,
        response: res,
        data: updatedResult,
      });
    } else {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      const result = await StaffAttendance.bulkCreate(
        Array.from({ length: endDate.getDate() - startDate.getDate() + 1 }, (_, i) => ({
          staff_id: staff_id,
          status: status,
          attendance_date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
          reason,
        }))
      );

      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_LEAVE_REQUEST_CREATED,
        response: res,
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
