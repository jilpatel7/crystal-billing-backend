import { IParty } from "./parties.interface";

export interface IPartyAddress {
  id: number;
  party_id: number;
  address: string;
  landmark: string;
  pincode: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  party: IParty;
}
export interface IPartyAddressCreate extends Omit<IPartyAddress, 'id' | 'landmark' | 'created_at' | 'updated_at' | 'deleted_at'> { }