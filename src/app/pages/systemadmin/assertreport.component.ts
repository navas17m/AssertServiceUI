
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { Common } from '../common';

import { APICallService } from '../services/apicallservice.service';
import { UserCarerMappingDTO } from './DTO/usercarermappingdto'

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
    selector: 'assertreport',
    templateUrl: './assertreport.component.template.html',
})

export class AssertReport {
    public searchText: string = "";
    public returnVal:any[];  
     
    lstAssertRegister=[];
    isLoading: boolean = false;
    controllerName = "AssertRegister";
    lstMunicipal = [];
    MunicipalId:number;   lstKeyPerformanceIndicator=[]; 
    lstBudgetApproval=[];   lstBudgetPlan=[];  
    lstWorkforceManagement=[]; lstComplianceAndRegulatory=[];   lstMaintenanceActivity=[];  
    lstriskmanagementandcontingencyplan=[];  lstQualityPlanandContinuousImprovement=[];
    constructor(private apiService: APICallService) {
         
        this.apiService.get("Municipal", "GetMunicipal").then(data => {
            this.lstMunicipal = data;           
        })
       //this.BindAssert();
    }
    getReport()
    {
        this.LoadReport();
    }  
    genPDF()
    {
        // const element = document.getElementById("content"); // Replace with your element's ID
        // html2canvas(element).then((canvas) => {
        //     const imgData = canvas.toDataURL("image/png");
        //     const pdf = new jsPDF("p", "mm", "a4");
        //     const imgWidth = 210; // A4 width in mm
        //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
        //    // alert(imgHeight);
        //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        //     pdf.save("assert.pdf");
        // });       
        const doc = new jsPDF('p', 'mm', 'a4'); // Portrait mode, millimeters, A4 size
        const content = document.getElementById("content");

        html2canvas(content, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            doc.save("AssertReport.pdf");
        });
    }    
    LoadReport() {
        this.isLoading=true;      
       
        this.apiService.get(this.controllerName, "GetAssertRegisters",this.MunicipalId).then(data => {
             this.lstAssertRegister = data;   
                   
         })
         this.apiService.get("budgetplan", "GetBudgetPlans", this.MunicipalId).then(data => { 
            this.lstBudgetPlan = data;           
         })
         this.apiService.get("budgetapproval", "GetBudgetApprovals", this.MunicipalId).then(data => { 
            this.lstBudgetApproval = data;           
         })
         this.apiService.get("KeyPerformanceIndicator", "GetKeyPerformanceIndicators",  this.MunicipalId).then(data => { 
            this.lstKeyPerformanceIndicator = data;           
         })
         this.apiService.get("WorkforceManagement", "GetWorkforceManagements", this.MunicipalId).then(data => { 
            this.lstWorkforceManagement = data;           
         })
         this.apiService.get("ComplianceAndRegulatory", "GetComplianceAndRegulatorys", this.MunicipalId).then(data => { 
            this.lstComplianceAndRegulatory = data;           
         })
         this.apiService.get("riskmanagementandcontingencyplan", "Getriskmanagementandcontingencyplans", this.MunicipalId).then(data => { 
            this.lstriskmanagementandcontingencyplan = data;           
         })
         this.apiService.get("qualityplanandcontinuousimprovement", "Getqualityplanandcontinuousimprovements",this.MunicipalId).then(data => { 
            this.lstQualityPlanandContinuousImprovement = data;           
         })
         this.apiService.get("MaintenanceActivity", "GetMaintenanceActivitys", this.MunicipalId).then(data => { 
            this.lstMaintenanceActivity = data;  
            this.isLoading=false;           
         })
         
    }    

}
