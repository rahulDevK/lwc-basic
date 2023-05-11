import { LightningElement, track, wire } from 'lwc';
import BOARD_OBJECT from '@salesforce/schema/Board__c';
import NAME_FIELD from '@salesforce/schema/Board__c.Name';
import DESCRIPTION_FIELD from '@salesforce/schema/Board__c.Description__c';
import NOOFSECTIONS_FIELD from '@salesforce/schema/Board__c.NoOfSections__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createBoard from '@salesforce/apex/BoardController.createBoard'
import getBoards from '@salesforce/apex/BoardController.getBoards'
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Description', fieldName: 'Description__c' },
    { label: 'No of sections', fieldName: 'NoOfSections__c' },
    {
        type: 'button', typeAttributes:{
            label: 'Open Board',
            name: 'openBoard',
            value: 'openBoard',
            title: 'Open Board',
        }
    }
]

export default class Boards extends NavigationMixin(LightningElement)  {
    objectApiName = BOARD_OBJECT
    boardFileds = {
        name: NAME_FIELD,
        description: DESCRIPTION_FIELD,
        noOfSections: NOOFSECTIONS_FIELD
    }
    columns = COLUMNS
    boardData = ''
    wiredBoardData = ''

    @wire (getBoards)
    getBoardDetails(result){
        this.wiredBoardData = result
        const {data, error} = result
        if(error){
            console.log(JSON.stringify(error))
        }else if(data){
            this.boardData = data
        }
    }

    showModal = false
    @track sections = []

    addBoard(){
        this.showModal = true
        this.sections = []
    }

    closeModal(){
        this.showModal = false
    }

    noOfSectionChangeHandler(event){
        this.sections = []
        const noOfSections = event.target.value;
        for(let i=0; i<noOfSections; i++){
            this.sections.push({id:`SectionId${i}`, label: `Section ${i+1} Title`})
        }
    }

    async handleSubmit(event){
        event.preventDefault();
        const fields = {...event.detail.fields}
        const sectionControls = this.template.querySelectorAll('[data-section-control]')
        console.log(typeof sectionControls)
        console.log(`Total Sections: ${sectionControls.length}`)

        let sectionList = []
        for(let control of sectionControls){

            sectionList.push({Name: control.value})
        }
        if(!this.validateData(fields,sectionList)){
            return;
        }
        let result = await createBoard({'board': fields, 'boardSections': sectionList})
        refreshApex(this.wiredBoardData);
        this.closeModal()
        this.showToastHelper('Board Created', 'New Board Created Successfully', 'success')        
    }

    validateData(fields, sectionList){
        const sectionNumbers = parseInt(fields.NoOfSections__c)
        if(!fields.NoOfSections__c || sectionNumbers <1 || sectionNumbers > 10){
            this.showToastHelper('Invalid Number', 'No of sections should be between 1 & 10 ', 'error')
            return false
        }
        if(sectionList.filter(a=>a.Name === '').length > 0){
            console.log('Secton list is empty')
            this.showToastHelper('Invalid Title', 'Section Title cannot be blank', 'error')
            return false
        }
        return true;
    }

    rowActionHandler(event){
        console.log(JSON.stringify(event.detail))
        const boardId = event.detail.row.id
        this.navigateToBoardRecordPage(boardId)
    }

    showToastHelper(title, message, variant){
        const event = new ShowToastEvent({
            title,
            message,
            variant
        })
        this.dispatchEvent(event)
    }

    navigateToBoardRecordPage(boardId){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: boardId,
                objectApiName: BOARD_OBJECT,
                actionName: 'view'
            }
        })
    }
}