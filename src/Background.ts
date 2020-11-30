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

    static readonly emptyImage: string = "";
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

    static gridy: number = undefined;
    static gridx: number = undefined;

    static init_grid(): void {
        this.gridy=18;
        const fullHeight = Layout.getWindowHeight();
        const fullWidth = Layout.getWindowWidth();
        const yshift = fullHeight / this.gridy;
        this.gridx = 2 * Math.round(fullWidth / (2 * yshift));
    }
    /**
     * initialize the interface
     */
    static init(): void {
        document.getElementById("buttonNoBackground").onclick = () => {
            Share.execute("backgroundClear", []);
        };
        document.getElementById("buttonMusicScore").onclick = () => {
            Share.execute("backgroundMusicScore", []);
        };
        document.getElementById("buttonGrid").onclick = () => {
            Share.execute("backgroundGrid", []);
        };

        (<HTMLInputElement>document.getElementById("inputBackground")).onchange = function (evt) {
            LoadSave.fetchFromFile((<HTMLInputElement>evt.target).files[0],
                (dataURL) => Share.execute("setBackground", [dataURL]));
        };
    }



    static storeDataURL(dataURL: string): void {
        const snapshotImg = (<HTMLImageElement>document.getElementById("backgroundSnapshotBackgroundImage"));
        if ((dataURL == undefined) || (dataURL == "undefined")) {
            Background.dataURL = undefined;
            snapshotImg.src = Background.emptyImage;
        }
        else {
            Background.dataURL = dataURL;
            snapshotImg.src = dataURL;
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
        Background.storeDataURL(dataURL);

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
        Background.storeDataURL(undefined);

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

        Background.storeDataURL(canvasBackground.toDataURL());
    }



    static grid(): void {
        Background.clear();
        this.init_grid();
        const COLORGRID = "rgb(50, 50, 50)";
        const PRESSURE = 0.1;
        const fullHeight = Layout.getWindowHeight();
        const fullWidth = Layout.getWindowWidth();
        const canvasBackground = getCanvasBackground();
        const x2 = 2 * Layout.getWindowWidth();
        const yshift = fullHeight / this.gridy;
        this.gridx = 2 * Math.round(fullWidth / (2 * yshift));
        const xshift = fullWidth / this.gridx;


        for (let i = 0; i <= this.gridy; i++) {
            const y = i * yshift;
            Drawing.drawLine(canvasBackground.getContext("2d"), 0, y, x2, y, PRESSURE, COLORGRID);
        }
        for (let j = 0; j <= 2 * this.gridx; j++) {
            const x = j * xshift;
            Drawing.drawLine(canvasBackground.getContext("2d"), x, 0, x, fullHeight, PRESSURE, COLORGRID);
        }
        BoardManager.saveCurrentScreen();
        Background.storeDataURL(canvasBackground.toDataURL());
    }

}
