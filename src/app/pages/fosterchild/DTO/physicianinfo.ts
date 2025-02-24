/// <reference path="../../basedto.ts" />


import { BaseDTO } from '../../basedto';
import { Contact } from '../../contact/contact';

export class PhysicianInfo extends BaseDTO
{
    PhysicianInfoId: number;
    PhysicianName: string;
    PhysicianTypeId: number;
    AddtoSiblingsRecord: boolean;
    AddtoParentorChildRecord: boolean;
    ContactInfo: Contact = new Contact();

}