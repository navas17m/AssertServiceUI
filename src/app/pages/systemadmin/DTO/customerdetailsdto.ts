
export class CustomerDetailsDTO {
    CustomerDetailsId: number;
    CardNumber: string;
    ExpMonth: string ;
    ExpYear: string ;
    Cvc: string;
    BillingEmail: string;
    BillingAddress: string;
    CreatedUserId: number = 1;
    CreatedDate: Date = new Date();
    UpdatedDate: Date = new Date();  
    UpdatedUserId: number = 1;
}