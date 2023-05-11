import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class BasicLWC extends LightningElement {   
    
    childTitle = "Hello from Parent"

    count = 0

    updateMessage(event){
        this.childTitle = event.target.value
    }

    handleClick(){
        this.showToast('LWC', 'Hello Javascript', 'success')
    }

    showToast(title, message, variant){
        const evt = new ShowToastEvent({
            title,
            message,
            variant,
        })
        this.dispatchEvent(evt)
    }

    handleIncreament(){
        this.count++;
    }

    handleDecreament(){
        this.count--;   
    }

    handleChange(event){
        const action = event.detail
        action === 'Add'? this.count++: this.count--
    }
}