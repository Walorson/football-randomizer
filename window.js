class Window {
    constructor() {
        this.isOpen = false;
        this.div = document.querySelector(".window");
        this.textarea = document.getElementById("window-textarea");
    }
    open() { 
        this.div.style.top = 0;
        this.isOpen = true;
    }
    close() {
        this.div.style.top = -1000+"px";
        this.isOpen = false;
    }
}
const loadWindow = new Window();
loadBtn.addEventListener("click",() => {
    if(!loadWindow.isOpen) loadWindow.open();
    else loadWindow.close();
});

const hideBtn = document.querySelector(".hideBtn");
hideBtn.addEventListener("click",() => {
    loadWindow.close();
});