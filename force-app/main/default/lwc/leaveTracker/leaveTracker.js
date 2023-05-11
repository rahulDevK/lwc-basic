import { LightningElement } from 'lwc';

export default class LeaveTracker extends LightningElement {

    refreshLeaveReqeuestHandler(event){
        setTimeout(() => {
            this.refs.leaveRequstComp.refreshGrid();    
        }, 0);
    }
}