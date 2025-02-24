
export class ListBoxDTO {

    SelectedValues: string;
    Options: ListBoxOptions = new ListBoxOptions();
    IsMandatory: boolean;
}


export class ListBoxOptions {
    Id: number;
    Value: string;
}