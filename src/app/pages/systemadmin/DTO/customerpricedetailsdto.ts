
export class CustomerPriceDetailsDTO {
    CustomerPriceDetailsId: number;
    AgencyProfileId:number;
    Reference:string;
    CustomerPriceLineItems: CustomerPriceLineItemDTO[] = [];
    CreatedUserId: number = 1;
    CreatedDate: Date = new Date();
    UpdatedDate: Date = new Date();  
    UpdatedUserId: number = 1;
}
export class CustomerPriceLineItemDTO  {
    CustomerPriceLineItemId: number;
    CustomerPriceDetailsId: number;
    Description: string;
    Quantity: number;
    UnitPrice: number;
    IsActive:boolean;
}