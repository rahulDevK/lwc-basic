import { LightningElement, wire } from 'lwc';
import getMyLeaves from '@salesforce/apex/LeaveRequstController.getMyLeaves';
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
export default class MyLeaves extends LightningElement {
    columns = COLUMNS
    myLeaves = []
    showModal = false
    recordId = ''
    modalHeader
    wiredLeavesData
    loggedInUser = USER_ID
    loading = false;

    @wire(getMyLeaves)
    getMyLeavesData(result){
        this.loading = true
        this.wiredLeavesData = result
        const {data, error} = result
        if(data){
            this.myLeaves = data
            this.myLeaves = data.map(a=>({
                ...a,
                cellClass: a.Status__c === 'Approved'? 'slds-theme_success': a.Status__c==='Rejected'? 'slds-theme_error':'',
                isEditEnabld: a.Status__c != 'Pending'
            }))
            this.loading = false
        }else if(error){
            this.myLeaves = []
            console.log('Error in getting leaves data: ' + JSON.stringify(error))
            this.loading = false
        }
    }

    get noLeaveRecordsFound(){
        return this.myLeaves.length===0 ? true: false;
    }

    handleRowAction(event){
        this.showModal = true
        this.recordId = event.detail.row.Id
        this.modalHeader = 'Update Leave'
    }

    popupCloseHandler(){
        this.showModal = false
    }

    addLeaveRecord(){
        this.showModal = true;
        this.recordId = ''
        this.modalHeader = 'Add Leave Record'
    }

    successHandler(){
        this.showModal = false
        refreshApex(this.wiredLeavesData);
        const refreshEvent = new CustomEvent('refreshleaverequests')
        this.dispatchEvent(refreshEvent)
        this.showToastHelper('Record Created', 'New Leave Record Created Successfully', 'success')
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