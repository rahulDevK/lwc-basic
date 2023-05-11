import { LightningElement, api, wire } from 'lwc';
import getLeaveRequests from '@salesforce/apex/LeaveRequstController.getLeaveRequests';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import USER_ID from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
const COLUMNS = [
    { label: 'Request Id', fieldName: 'Name', cellAttributes: {class:{fieldName:'cellClass'}}},
    { label: 'From Date', fieldName: 'From_Date__c', type: 'date', cellAttributes: {class:{fieldName:'cellClass'}} },
    { label: 'To Date', fieldName: 'To_Date__c', type: 'date', cellAttributes: {class:{fieldName:'cellClass'}} },
    { label: 'Reason', fieldName: 'Reason__c', type: 'text', cellAttributes: {class:{fieldName:'cellClass'}} },
    { label: 'Status', fieldName: 'Status__c', type: 'text', cellAttributes: {class:{fieldName:'cellClass'}} },
    { label: 'Manager Commnent', fieldName: 'Manager_Comment__c', type: 'text', cellAttributes: {class:{fieldName:'cellClass'}} },
    {
        type: 'button', typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            value: 'edit',
            disabled: {fieldName:'isEditEnabld'}
        }, cellAttributes: {class:{fieldName:'cellClass'}}
    }
];
export default class leaveRequest extends LightningElement {
    columns = COLUMNS
    leaveRequests = []
    showModal = false
    recordId = ''
    modalHeader
    wiredLeaveRequestData
    loggedInUser = USER_ID
    
    @wire(getLeaveRequests)
    getLeaveRequestData(result){
        this.wiredLeaveRequestData = result
        const {data, error} = result
        if(data){
            this.leaveRequests = data
            this.leaveRequests = data.map(a=>({
                ...a,
                cellClass: a.Status__c === 'Approved'? 'slds-theme_success': a.Status__c==='Rejected'? 'slds-theme_error':'',
                isEditEnabld: a.Status__c != 'Pending'
            }))
        }else if(error){
            this.leaveRequests = []
            console.log('Error in getting leaves data: ' + JSON.stringify(error))
        }
    }

    get noLeaveRecordsFound(){
        return this.leaveRequests.length===0 ? true: false;
    }

    handleRowAction(event){
        this.showModal = true
        this.recordId = event.detail.row.Id
        this.modalHeader = 'Update Leave'
    }

    popupCloseHandler(){
        this.showModal = false
    }

    successHandler(){
        this.showModal = false
        this.showToastHelper('Record Updated', 'Leave Record Updated Successfully', 'success')
        this.refreshGrid();
    }

    handleActive(){
        this.refreshGrid()
    }
    
    @api
    refreshGrid(){
        refreshApex(this.wiredLeaveRequestData);
    }

    showToastHelper(title, message, variant){
        const event = new ShowToastEvent({
            title,
            message,
            variant
        })
        this.dispatchEvent(event)
    }
}