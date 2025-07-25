import { Request, Response } from 'express';
import generalResponse from '../../../helper';
import { PARTY_RESPONSE } from '../enum';
import Party from '../../../sequelize/models/party';
import { Op } from 'sequelize';
import _ from 'lodash';
import PartyAddress from '../../../sequelize/models/party-address';
import { removeKeys } from '../../../utils';
import db from '../../../sequelize/models';

export const createParty = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const {
      gstin_no,
      name,
      email,
      personal_phone,
      office_phone,
      logo,
      party_addresses,
    } = req.body;
    const result = await Party.create(
      {
        company_id,
        name,
        office_phone,
        email,
        gstin_no,
        logo,
        personal_phone,
        party_addresses,
      },
      { include: [{ model: PartyAddress }] }
    );
    const data = result.toJSON();
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_CREATED,
      response: res,
      data: removeKeys(data, ['company_id', 'created_at', 'updated_at']),
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const updateParty = async (req: Request, res: Response) => {
  const transaction = await db.connect().transaction();
  try {
    const company_id = +(req.user || 0);
    const {
      id,
      gstin_no,
      name,
      email,
      personal_phone,
      office_phone,
      logo,
      party_addresses = [],
      removed_address_ids = [],
    } = req.body;

    const party = await Party.findByPk(id);
    if (!party) {
      return generalResponse({
        message: PARTY_RESPONSE.PARTY_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    // Update Party details
    await Party.update(
      {
        email,
        gstin_no,
        logo,
        office_phone,
        name,
        personal_phone,
      },
      {
        where: { id, company_id },
        transaction,
      }
    );

    // Loop through party_addresses
    for (const addr of party_addresses) {
      const { id: addressId, address, landmark, pincode } = addr;

      if (addressId) {
        // Update existing address
        await PartyAddress.update(
          {
            address,
            landmark,
            pincode,
          },
          {
            where: {
              id: addressId,
              party_id: id,
            },
            transaction,
          }
        );
      } else {
        // Create new address
        await PartyAddress.create(
          {
            party_id: id,
            address,
            landmark,
            pincode,
          },
          { transaction }
        );
      }
    }

    // Delete addresses by ID
    if (Array.isArray(removed_address_ids) && removed_address_ids.length > 0) {
      await PartyAddress.destroy({
        where: {
          id: removed_address_ids,
          party_id: id,
        },
        transaction,
      });
    }

    await transaction.commit();

    return generalResponse({
      message: PARTY_RESPONSE.PARTY_UPDATED,
      response: res,
      data: null,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const deleteParty = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const party = await Party.findByPk(id);
    if (!party) {
      return generalResponse({
        message: PARTY_RESPONSE.PARTY_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    const result = await Party.destroy({
      where: { id },
      individualHooks: true,
    });
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_DELETED,
      response: res,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const getParty = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const party = await Party.findByPk(Number(id), {
      include: [
        {
          model: PartyAddress,
          attributes: ['id', 'party_id', 'address', 'landmark', 'pincode'],
        },
      ],
    });
    if (!party) {
      return generalResponse({
        message: PARTY_RESPONSE.PARTY_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FETCH_SUCCESS,
      response: res,
      data: party,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const getAllParty = async (req: Request, res: Response) => {
  try {
    let { sort = 'id', order = 'DESC', page = 1, limit = 10, search = '' } = req.query;
    const company_id = +(req.user || 0);

    page = +page;
    limit = +limit;

    const offset = (page - 1) * limit;

    const party = await Party.findAndCountAll({
      include: [
        {
          model: PartyAddress,
          attributes: ['id', 'party_id', 'address', 'landmark', 'pincode'],
        },
      ],
      attributes: [
        'id',
        'name',
        'email',
        'gstin_no',
        'office_phone',
        'personal_phone',
        'logo',
        'created_at',
        'updated_at',
      ],
      where: {
        company_id,
        name: { [Op.like]: `%${(search as string).toLowerCase()}%` },
      },
      order: [[sort as string, order as "ASC" | "DESC"]],
      limit: limit,
      offset: offset
    });

    const responseData = {
      totalRecords: party.count, // Total number of records
      totalPages: Math.ceil(party.count / limit), // Total pages
      currentPage: page, // Current page
      data: party.rows, // Paginated data
    };

    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FETCH_SUCCESS,
      response: res,
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const getAllPartyIdsAndNames = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const party = await Party.findAll({
      attributes: ['id', 'name'],
      where: {
        company_id,
      },
    });

    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FETCH_SUCCESS,
      response: res,
      data: party,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
