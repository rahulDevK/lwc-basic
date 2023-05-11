import { LightningElement, api } from 'lwc';

export default class BasicChildComp extends LightningElement {

    obj = {
        action: 'none'
    }

    increaseCount(){
        const evt = new CustomEvent('add');
        this.dispatchEvent(evt)
    }

    changeCount(event){
        // console.log(event.target.label)
        // event.target.label === 'Add' ? this.obj.action = 'Add' : this.obj.action = 'Subtract'
        const action = event.target.label
        const evt = new CustomEvent('changecount', {
            detail: action
        });
        this.dispatchEvent(evt)
    }
    
}