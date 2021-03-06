import { User } from './User';
import { BoardManager } from './boardManager';
import { EraserCursor } from './EraserCursor';
import { Layout } from './Layout';
import { Drawing } from './Drawing';
import { Tool } from './Tool';

const ERASEMODEDEFAULTSIZE = 10;

export class ToolEraser extends Tool {

    private eraseModeBig = false;
    private eraseLineWidth = ERASEMODEDEFAULTSIZE;


    mousedown(evt): void {
        this.eraseModeBig = false;
        Drawing.clearLine(this.x, this.y, this.x, this.y, ERASEMODEDEFAULTSIZE);
    }


    mousemove(evt): void {
        const evtX = evt.offsetX;
        const evtY = evt.offsetY;

        //this.eraseLineWidth = 10;
        if (this.isDrawing) {

            this.eraseLineWidth = 10 + 30 * evt.pressure;

            if (Math.abs(this.x - this.xInit) > Layout.getWindowWidth() / 4 ||
                Math.abs(this.y - this.yInit) > Layout.getWindowHeight() / 4)
                this.eraseModeBig = true;

            if (this.eraseModeBig) {
                this.eraseLineWidth = 128;
            }

            if (this.user.isCurrentUser) {
                this.setToolCursorImage(EraserCursor.getStyleCursor(this.eraseLineWidth));
            }

            Drawing.clearLine(this.x, this.y, evtX, evtY, this.eraseLineWidth);

        }
        /*this.toolCursor.style.left = evtX - this.eraseLineWidth / 2;
        this.toolCursor.style.top = evtY - this.eraseLineWidth / 2;*/
    }

    mouseup(evt): void {
        if (this.user.isCurrentUser) {
            //restore the eraser to the original size {
            this.eraseLineWidth = ERASEMODEDEFAULTSIZE;
            this.setToolCursorImage(EraserCursor.getStyleCursor(this.eraseLineWidth));

        }
        BoardManager.saveCurrentScreen();
    }

    constructor(user: User) {
        super(user);
        if (this.user.isCurrentUser) {
            document.getElementById("buttonEraser").hidden = true;
            document.getElementById("buttonChalk").hidden = false;
            this.setToolCursorImage(EraserCursor.getStyleCursor(this.eraseLineWidth));
        }
    }


}