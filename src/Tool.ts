import { User } from './User';
import { Background } from './Background';
import { Layout } from './Layout';

/**
 * This is an abstract tool (like erasing, drawing, drawing a line, rectangle, drawing a circle)
 */
export abstract class Tool {
    xInit = 0;
    yInit = 0;

    x = 0;
    y = 0;

    isDrawing = false;
    user: User;

    constructor(user: User) {
        this.user = user;
    }

    abstract mousedown(evt): void;
    abstract mousemove(evt): void;
    abstract mouseup(evt): void;
    


    setToolCursorImage(srcImage: { data: string, x: number, y: number }): void {
        document.getElementById("canvas").style.cursor = `url(${srcImage.data}) ${srcImage.x} ${srcImage.y}, auto`;
        // this.toolCursor.src = srcImage;
    }

    /** 
     * snaps number to grid, coord is true for x snapping, false for y
     */
    snap(x: number, coord: boolean): number {
        const size : number = (coord) ? Layout.getWindowWidth() : Layout.getWindowHeight();
        const grid : number = (coord) ? Background.gridx : Background.gridy;
        console.log("grid :", grid);
        console.log("size :", size);
        return size*Math.round((x*grid)/size)/grid;
    }

    updateCursor(): void {
    }
}
