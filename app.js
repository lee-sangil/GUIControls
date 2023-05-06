import { GUIControls } from './GUIControls.js';

class App{
    constructor(){
        const gui_controls = {
            'bool': true,
            'select': 'mode1'
        };
        const gui = new GUIControls({width: 50});
        gui.add(gui_controls, 'bool', './assets/target.png').title('Bool').set(false).onChange(()=>{
            console.log(gui_controls.bool);
            if (gui_controls.bool) gui.controller['select'].inactive();
            else gui.controller['select'].active();
        });
        gui.add(gui_controls, 'select', {'mode1': './assets/search.png', 'mode2': './assets/padlock.png', 'mode3': './assets/target.png'}).title('Mode').set('mode3').onChange(()=>{
            console.log(gui_controls.select);
        });
    }
}

window.onload = () => {
    new App();
}