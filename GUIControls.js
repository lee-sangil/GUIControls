class GUIController {
    constructor(object, property, width) {
        this.alive = true;

        this.object = object;
        this.property = property;

        const button = document.createElement('button');
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.width = width + 'px';
        button.style.height = width + 'px';
        button.style.borderRadius = '50%';
        button.style.margin = '0px 5px 5px 0px';
        button.style.overflow = 'hidden';
        button.draggable = false;
        button.onpointerenter = ()=>{
            if (this.alive) button.style.backgroundColor = 'rgba(255,255,255,0.2)';
        };
        button.onpointerleave = ()=>{
            if (this.alive) button.style.backgroundColor = 'rgba(255,255,255,0)';
        }
        button.onpointerdown = ()=>{
            if (this.alive) button.style.backgroundColor = 'rgba(255,255,255,0.5)';
        }
        button.onpointerup = ()=>{
            if (this.alive) button.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }
        this.button = button;

        const img = document.createElement('img');
        img.style.width = '60%'; // lesser than 70.71%
        img.style.height = '60%';
        img.draggable = false;
        this.img = img;

        this.button.appendChild(this.img);
    }

    title(string) {
        this.button.title = string;
        return this;
    }

    inactive() {
        this.alive = false;
        this.update();
    }

    active() {
        this.alive = true;
        this.update();
    }
}

class GUIControllerBoolean extends GUIController{
    constructor(object, property, icon, width) {
        super(object, property, width);

        this.img.src = icon;

        this.update();
    }

    set(value) {
        this.object[this.property] = value;
        this.update();
        return this;
    }

    update() {
        if (this.object[this.property])
            this.img.style.opacity = 1;
        else
            this.img.style.opacity = 0.2;
    }

    onChange(func) {
        this.button.onclick = ()=>{
            this.set(!this.object[this.property]);
            func();
        }
        return this;
    }
}

class GUIControllerSelect extends GUIController{
    constructor(object, property, icon, width) {
        super(object, property, width);

        this.icon = icon;
        this.key = Object.keys(icon);
        this.index = this.key.indexOf(this.object[this.property]);
        this.length = this.key.length;
        
        this.update();
    }

    set(value) {
        this.index = this.key.indexOf(value);
        this.object[this.property] = value;
        this.update();
        return this;
    }

    update() {
        if (this.alive) {
            this.img.style.opacity = 1;
            this.img.src = this.icon[this.object[this.property]];
        }else {
            this.img.style.opacity = 0.2;
        }
    }

    onChange(func) {
        this.button.onclick = ()=>{
            if (this.alive) {
                ++this.index;
                if (this.index >= this.length) this.index = 0;

                this.set(Object.keys(this.icon)[this.index]);

                func();
            }
        }
        return this;
    }
}

export class GUIControls {
    constructor(param) {
        this.width = param.width;
        const container = document.createElement('div');
        container.style.position = 'fixed'
        container.style.top = '50vh';
        container.style.right = '5px';
        container.style.width = this.width + 'px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.webkitUserSelect = 'none';
        container.style.userSelect = 'none';
        container.style.transform = 'translate(0%, -50%)';
        container.style.backgroundColor = 'rgba(0,0,0,0.2)';
        container.style.borderRadius = param.width * 0.2 + 'px';
        container.style.padding = param.width * 0.1 + 'px';
        container.draggable = false;
        document.body.appendChild(container);

        this.container = container;
        this.controller = [];
    }

    add(object, property, icon) {
        let controller;
        if (icon.constructor == Object) { // Finite state menu
            controller = new GUIControllerSelect(object, property, icon, this.width);
        }else { // Turn on/off menu
            controller = new GUIControllerBoolean(object, property, icon, this.width);
        }
        this.controller[property] = controller;

        this.container.appendChild(controller.button);
        return controller;
    }
}