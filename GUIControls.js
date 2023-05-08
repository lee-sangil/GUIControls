const PARAM = {
    status_button_size_ratio: 0.3,
    container_margin: 5,
    button_margin: 5,
    alpha_1: 0.2, // hover
    alpha_2: 0.5, // click
}

function addPointerInteractionHint(object, active = true) {
    object.style.backgroundColor = 'rgba(255,255,255,0)';
    object.onpointerenter = ()=>{
        if (active) object.style.backgroundColor = 'rgba(255,255,255,' + PARAM.alpha_1 + ')';
    };
    object.onpointerleave = ()=>{
        if (active) object.style.backgroundColor = 'rgba(255,255,255,0)';
    }
    object.onpointerdown = ()=>{
        if (active) object.style.backgroundColor = 'rgba(255,255,255,' + PARAM.alpha_2 + ')';
    }
    object.onpointerup = ()=>{
        if (active) object.style.backgroundColor = 'rgba(255,255,255,' + PARAM.alpha_1 + ')';
    }
}

class GUIController {
    constructor(object, property, width) {
        this.alive = true;

        this.object = object;
        this.property = property;

        const button = document.createElement('button');
        button.className = 'GUIbutton';
        button.style.border = 'none';
        button.style.width = width + 'px';
        button.style.height = width + 'px';
        button.style.borderRadius = '50%';
        button.style.margin = PARAM.button_margin + 'px 0px 0px 0px';
        button.style.overflow = 'hidden';
        button.draggable = false;
        addPointerInteractionHint(button, this.alive);
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
            this.img.style.opacity = PARAM.alpha_1;
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
            this.img.style.opacity = PARAM.alpha_1;
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
        this.isMinimized = false;
        this.width = param.width;
        this.height = param.width * PARAM.status_button_size_ratio;
        this.pts_x = 0;
        this.pts_y = 0;
        this.move_x = 0;
        this.move_y = 0;
        this.top = 0.5 * window.innerHeight;
        this.right = 5;
        this.ispointerdown = false;

        const container = document.createElement('div');
        container.style.position = 'fixed'
        container.style.top = this.top + 'px';
        container.style.right = this.right + 'px';
        container.style.width = param.width + 'px';
        container.style.transition = 'height 0.3s ease, right 0.3s ease';
        container.style.webkitUserSelect = 'none';
        container.style.userSelect = 'none';
        container.style.overflow = 'hidden';
        container.style.backgroundColor = 'rgba(0,0,0,0.2)';
        container.style.borderRadius = param.width * 0.2 + 'px';
        container.style.padding = param.width * 0.1 + 'px';
        container.draggable = false;
        document.body.appendChild(container);

        const window_controller = document.createElement('div');
        window_controller.addEventListener('pointerdown', (event)=>{
            this.pts_x = event.clientX;
            this.pts_y = event.clientY;
            this.move_x = 0;
            this.move_y = 0;
            this.ispointerdown = true;
            this.container.style.transition = 'height 0.3s ease';
        });
        window.addEventListener('pointermove', (event)=>{
            if (this.ispointerdown) {
                this.move_x = event.clientX - this.pts_x;
                this.move_y = event.clientY - this.pts_y;
                this.pts_x = event.clientX;
                this.pts_y = event.clientY;
                this.top = Math.max(Math.min(this.top+this.move_y, window.innerHeight - this.height - 2*PARAM.container_margin), 0);
                this.right = Math.max(Math.min(this.right-this.move_x, window.innerWidth - this.width - 2*PARAM.container_margin - 5), 5);
                this.container.style.top = this.top + 'px';
                this.container.style.right = this.right + 'px';
            }
        });
        window.addEventListener('pointerup', (event)=>{
            if (this.ispointerdown) {
                this.ispointerdown = false;
                this.right = (this.right > 0.5 * (window.innerWidth - this.width))? window.innerWidth - this.width - 2*PARAM.container_margin - 5 : 5;
                this.container.style.right = this.right + 'px';
                this.container.style.transition = 'height 0.3s ease, right 0.3s ease';
            }
        });

        const minimize_button = document.createElement('div');
        minimize_button.style.position = 'relative';
        minimize_button.style.left = param.width * 0.2 * 0.6 + 'px';
        minimize_button.style.height = param.width * PARAM.status_button_size_ratio + 'px';
        minimize_button.style.width = param.width * PARAM.status_button_size_ratio + 'px';
        minimize_button.style.borderRadius = '50%';
        addPointerInteractionHint(minimize_button);
        minimize_button.addEventListener('click', ()=>{
            const child = document.getElementsByClassName('GUIbutton');
            if (this.isMinimized) {
                for (let i = 0; i < child.length; ++i) {
                    child[i].style.pointerEvents = 'auto';
                    container.style.height = this.height + 'px';
                }
                this.isMinimized = false;
            }else {
                for (let i = 0; i < child.length; ++i) {
                    child[i].style.pointerEvents = 'none';
                    container.style.height = (this.width * PARAM.status_button_size_ratio) + 'px';
                }
                this.isMinimized = true;
            }
        });

        const horizon_bar = document.createElement('div');
        horizon_bar.style.borderRadius = '2px';
        horizon_bar.style.position = 'absolute';
        horizon_bar.style.height = this.width * 0.04 + 'px';
        horizon_bar.style.width = '60%';
        horizon_bar.style.backgroundColor = 'white';
        horizon_bar.style.left = '50%';
        horizon_bar.style.top = '50%';
        horizon_bar.style.transform = 'translate(-50%, -50%)';

        minimize_button.appendChild(horizon_bar);
        window_controller.appendChild(minimize_button);
        container.appendChild(window_controller);

        this.container = container;
        this.controller = [];
    }

    updateDimension() {
        this.right = (this.right > 0.5 * (window.innerWidth - this.width))? window.innerWidth - this.width - 2*PARAM.container_margin - 5 : 5;
        this.container.style.right = this.right + 'px';
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
        this.height += this.width + PARAM.button_margin;
        this.container.style.height = this.height + 'px';
        return controller;
    }
}