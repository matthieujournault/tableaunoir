import { Layout } from './Layout';
import { ErrorMessage } from './ErrorMessage';
import { OptionManager } from './OptionManager';

export class Toolbar {


    /**
     * initialization
     */
    static init(): void {
        if (Layout.isTactileDevice()) {
            try {
                document.getElementById("inputToolbar").hidden = true; //on phone or tablet, we can not remove the toolbar, therefore the button is hidden

                const spans = <NodeListOf<HTMLSpanElement>>document.querySelectorAll("#controls > span");
                for (let i = 0; i < spans.length; i++) {
                    spans[i].hidden = true;
                }
            }
            catch (e) {
                ErrorMessage.show("Error in loading the toolbar. You can however use Tableaunoir.")
            }

        }

        OptionManager.boolean({
            name: "toolbar",
            defaultValue: true,
            onChange: (isToolbar) => {
                if (Layout.isTactileDevice()) //on android etc. the toolbar is ALWAYS visible
                    Toolbar.getToolbar().hidden = false;
                else
                    Toolbar.getToolbar().hidden = !isToolbar;
            }
        });

        Toolbar.helpButtonDivide();
        Toolbar.helpForButtonCloseControls();

    }





    /**
     * help animation for hiding the toolbar
     */
    static helpForButtonCloseControls(): void {
        document.getElementById("buttonCloseControls").onmouseenter = () => { Toolbar.getToolbar().style.opacity = "0.5" };
        document.getElementById("buttonCloseControls").onmouseleave = () => { Toolbar.getToolbar().style.opacity = "1" };
    }

    /**
     * help animation for divide the screen
     */
    static helpButtonDivide(): void {
        const divideLine = document.createElement("div");
        divideLine.className = "divideLineHelp";

        document.getElementById("buttonDivide").onmouseenter = () => {
            divideLine.style.left = "" + Layout.getXMiddle();
            document.getElementById("board").prepend(divideLine);
        };
        document.getElementById("buttonDivide").onmouseleave = () => {
            divideLine.remove();
        };
    }



    static getToolbar(): HTMLElement {
        return document.getElementById("controls");
    }

    /**
     * @description toogle the visibility of the toolbar
     */
    static toggle(): void {
        const controls = Toolbar.getToolbar();
        controls.hidden = !controls.hidden;
        Layout._resize();
    }
}
