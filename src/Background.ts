import { Share } from './share';
import { BoardManager } from './boardManager';
import { getCanvasBackground } from './main';
import { Layout } from './Layout';
import { LoadSave } from './LoadSave';
import { Menu } from './Menu';
import { Drawing } from './Drawing'


/**
 * this class is for the background (image) to be added behind your board
 */
export class Background {

    /**
     * stores the current img in binary (to be sent later for instance)
     */
    static dataURL: string = undefined;

    /**
     * @returns yes iff there is a background
     */
    static get is(): boolean {
        return Background.dataURL != undefined;
    }

    /**
     * initialize the interface
     */
    static init(): void {
        document.getElementById("buttonNoBackground").onclick = () => {
            Share.execute("backgroundClear", []); Menu.hide();
        };
        document.getElementById("buttonMusicScore").onclick = () => {
            Share.execute("backgroundMusicScore", []);
            Menu.hide();
        };
        document.getElementById("buttonGrid").onclick = () => {
            Share.execute("backgroundGrid", []);
            Menu.hide();
        };


        (<HTMLInputElement>document.getElementById("inputBackground")).onchange = function (evt) {
            LoadSave.fetchFromFile((<HTMLInputElement>evt.target).files[0],
                (dataURL) => Share.execute("setBackground", [dataURL]));
        }
    }

    /**
     * 
     * @param dataURL 
     * @description set the background to be the image described in dataURL
     */
    static set(dataURL: string): void {
        Background.clear(); //before assigning Background.dataURL

        console.log("set background");
        const img = new Image();
        Background.dataURL = dataURL;
        img.src = dataURL;
        
        img.onload = () => {
            const canvasBackground = getCanvasBackground();
            //const x = (Layout.getWindowWidth() - scaleWidth) / 2;
            const x = 0;
            const height = Layout.getWindowHeight();
            const scaleWidth = img.width * height / img.height;
            canvasBackground.getContext("2d").drawImage(img, x, 0, scaleWidth, height);
            console.log("background displayed");
        }
            
    }


    /**
     * @description delete the background
     */
    static clear(): void {
        const canvasBackground = getCanvasBackground();
        Background.dataURL = undefined;
        canvasBackground.getContext("2d").clearRect(0, 0, canvasBackground.width, canvasBackground.height);
    }

    /**
     * @description draw a music score thing as a background
     */
    static musicScore(): void {
        Background.clear();
        const COLORSTAFF = "rgb(128, 128, 255)";
        const fullHeight = Layout.getWindowHeight() - 32;
        const canvasBackground = getCanvasBackground();

        const x = 0;
        const x2 = 2 * Layout.getWindowWidth();
        const ymiddleScreen = fullHeight / 2;
        const yshift = fullHeight / 7;
        const drawStaff = (ymiddle) => {
            const space = fullHeight / 30;

            for (let i = -2; i <= 2; i++) {
                const y = ymiddle + i * space;
                Drawing.drawLine(canvasBackground.getContext("2d"), x, y, x2, y, 1.0, COLORSTAFF);
            }
        }

        drawStaff(ymiddleScreen - yshift);
        drawStaff(ymiddleScreen + yshift);

        BoardManager.saveCurrentScreen();

        Background.dataURL = canvasBackground.toDataURL();
    }
    static grid(): void {
        Background.clear();
        const gridy = 18;

        const COLORSTAFF = "rgb(50, 50, 50)";
        const fullHeight = Layout.getWindowHeight();
        const fullWidth = Layout.getWindowWidth();
        const canvasBackground = getCanvasBackground();
        const x2 = 2 * Layout.getWindowWidth();
        const yshift = fullHeight / gridy;
        const gridx = 2 * Math.round(fullWidth / (2*yshift));
        const xshift = fullWidth / gridx;


        for (let i = 0 ; i <= gridy; i++) {
            const y =  i * yshift;
            Drawing.drawLine(canvasBackground.getContext("2d"), 0, y, x2, y, 0.1, COLORSTAFF);
        }
        for (let j = 0 ; j <= 2*gridx; j++) {
            const x =  j * xshift;
            Drawing.drawLine(canvasBackground.getContext("2d"), x, 0, x, fullHeight, 0.1, COLORSTAFF);
        }
        BoardManager.saveCurrentScreen();
    }

}
