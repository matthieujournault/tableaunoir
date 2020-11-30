import { ToolEllipseByCenter } from './ToolEllipseByCenter';
import { ToolEllipseByBorder } from './ToolEllipseByBorder';
import { ToolLine } from './ToolLine';
import { CircularMenu } from './CircularMenu';
import { ToolRectangle } from './ToolRectangle';
import { ToolDraw } from './ToolDraw';
import { ToolEraser } from './ToolEraser';
import { MagnetManager } from './magnetManager';
import { UserManager } from './UserManager';
import { Background } from './Background';




/**
 * Represents a user (maybe you?)
 */
export class User {
    isToolDraw(): boolean { return this.tool instanceof ToolDraw; }
    get isToolErase(): boolean { return this.tool instanceof ToolEraser; }

    get x(): number { return this.tool.x; }
    get y(): number { return this.tool.y; }

    alreadyDrawnSth = false; // true if something visible has been drawn (If still false, draw a dot)
    canWrite = true;
    color = "white";
    cursor = undefined;
    tool = undefined;
    elementName = undefined;
    userID = "0";
    snapmode = false;
    snapcursor = undefined;
    
    private _name = "";

    set name(newName: string) {
        this._name = newName;
        if (!this.isCurrentUser)
            this.elementName.innerHTML = this._name;
    }

    get name(): string { return this._name; }

    setUserID(userID: string): void { this.userID = userID; }

    setCanWrite(bool: boolean): void { this.canWrite = bool; }

    cantoggleSnapMode(): boolean {
        return (this.snapmode || (!(typeof(Background.gridx) === 'undefined') && !(typeof(Background.gridy) === 'undefined') ))
    }

    toggleSnapMode(): void {
        if (this.snapmode) {
            this.snapmode = false;
            document.getElementById("snapcursor").removeChild(this.snapcursor);
        } else if (!(typeof(Background.gridx) === 'undefined') && !(typeof(Background.gridy) === 'undefined') ) {
            this.snapmode = true;
            document.getElementById("snapcursor").appendChild(this.snapcursor);
        }
    }
    
    /**
     *
     * @param {*} isCurrentUser that tells whether the user is the current one
     * @description create the user.
     */
    constructor(isCurrentUser: boolean) {
        if (!isCurrentUser) {
            this.cursor = document.createElement("div");
            this.cursor.classList.add("cursor");
            this.elementName = document.createElement("div");
            this.elementName.classList.add("userNameCursor");
            document.getElementById("cursors").appendChild(this.cursor);
            document.getElementById("cursors").appendChild(this.elementName);
        }
        this.snapcursor = document.createElement("div");
        this.snapcursor.classList.add("snapcursor");
        document.getElementById("snapcursor").appendChild(this.snapcursor);

        this.tool = new ToolDraw(this);
    }



    /**
     * @returns true iff the user is the current user (the one that controls the mouse)
     */
    get isCurrentUser(): boolean { return (this == UserManager.me); }

    /**
     * tells that the user has disconnected
     */
    destroy(): void {
        document.getElementById("cursors").removeChild(this.cursor);
        this.elementName.remove();
    }

    setCurrentColor(color: string): void {
        this.color = color;
        this.tool.updateCursor();
    }

    getCurrentColor(): string {
        return this.color;
    }



    switchChalk(): void { this.tool = new ToolDraw(this); }
    switchErase(): void { this.tool = new ToolEraser(this); }
    switchLine(): void { this.tool = new ToolLine(this); }
    switchRectangle(): void { this.tool = new ToolRectangle(this); }
    switchEllipseByBorder(): void { this.tool = new ToolEllipseByBorder(this); }
    switchEllipseByCenter(): void { this.tool = new ToolEllipseByCenter(this); }


    mousedown(evt): void {
        MagnetManager.setInteractable(false);

        //unselect the selected element (e.g. a text in edit mode)
        (<HTMLElement>document.activeElement).blur();

        this.tool.isDrawing = true;

        //console.log("mousedown")
        this.tool.x = (this.snapmode) ? this.tool.snap(evt.offsetX, true) : evt.offsetX;
        this.tool.y = (this.snapmode) ? this.tool.snap(evt.offsetY, false) : evt.offsetY;

        this.tool.xInit = this.tool.x;
        this.tool.yInit = this.tool.y;

        const newevent = { pressure : evt.pressure, offsetX : this.tool.x, offsetY : this.tool.y, shiftKey: evt.shiftKey};

        if (this.canWrite)
            this.tool.mousedown(newevent);

        if (this.isCurrentUser)
            CircularMenu.hide();
    }



    mousemove(evt): void {
        const evtX = (this.snapmode) ? this.tool.snap(evt.offsetX, true) : evt.offsetX;
        const evtY = (this.snapmode) ? this.tool.snap(evt.offsetY, false) : evt.offsetY;
        if (!this.isCurrentUser) {
            this.cursor.style.left = evtX - 8;
            this.cursor.style.top = evtY - 8;
            this.elementName.style.left = evtX - 8;
            this.elementName.style.top = evtY + 8;
        } else {
            if (this.snapmode) {
                this.snapcursor.style.left = evtX - 8;
                this.snapcursor.style.top = evtY - 8;
            }
        }

        const newevent = { pressure : evt.pressure, offsetX : evtX, offsetY : evtY, shiftKey: evt.shiftKey};

        if (this.canWrite) {
            this.tool.mousemove(newevent);
        }

        this.tool.x = evtX;
        this.tool.y = evtY;
    }


    mouseup(evt): void {
        MagnetManager.setInteractable(true);
        const evtX = (this.snapmode) ? this.tool.snap(evt.offsetX, true) : evt.offsetX;
        const evtY = (this.snapmode) ? this.tool.snap(evt.offsetY, true) : evt.offsetY;
        const newevent = { pressure : evt.pressure, offsetX : evtX, offsetY : evtY, shiftKey: evt.shiftKey};

        if (this.canWrite)
            this.tool.mouseup(newevent);

        this.tool.isDrawing = false;
    }
}
