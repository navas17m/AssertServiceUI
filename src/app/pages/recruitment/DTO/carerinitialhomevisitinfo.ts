/// <reference path="carerinfo.ts" />

import { BaseDTO } from '../../basedto';
import { DynamicValue } from '../../dynamic/dynamicvalue';
import { CarerInfo } from './carerinfo';
export class CarerInitialHomeVisitInfo extends BaseDTO {


    CarerInitialHomeVisitInfoId: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    ControlLoadFormat = [];
    DynamicValue: DynamicValue = new DynamicValue();
    CarerInfoPC: CarerInfo = new CarerInfo();
    CarerInfoSC: CarerInfo = new CarerInfo();
    dynamicformcontrol = [];
    IsScCarer: boolean = false; 
    CarerInfo: CarerInfo[] = [];
}

export class CarerInitialHomeVisitInfoNewDTO extends BaseDTO {

    CarerInitialHomeVisitInfoId: number;
    CarerParentId: number;
    FieldId: number;
    FieldValue: string;
    ControlLoadFormat = [];
    DynamicValue: DynamicValue = new DynamicValue();
    CarerInfoPC: CarerInfo = new CarerInfo();
    CarerInfoSC: CarerInfo = new CarerInfo();
    dynamicformcontrol = [];
    IsScCarer: boolean = false;
}