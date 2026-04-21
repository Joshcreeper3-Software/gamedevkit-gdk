function imageToArray(value: Image): Array<number> {
    let array = [];
    for (let i = 0; i < value.height; i++) {
        for (let j = 0; j < value.width; j++) {
            array.push(value.getPixel(j, i));
        }
    }
    return array;
}

function arrayToImage(value: Array<number>, width: number, height: number): Image {
    let img = image.create(width, height);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            img.setPixel(j, i, value[width * i + j]);
        }
    }
    return img;
}

function stringToNumberArray(value: Array<string>): Array<number> {
    let result = [];
    for (let i = 0; i < value.length; i++) {
        for (let j = 0; j < value[i].length; j++) {
            result.push(value[i].charCodeAt(j));
        }
        if (i < value.length - 1) {
            result.push(-1);
        }
    }
    return result;
}

function stringFromNumberArray(value: Array<number>): Array<string> {
    let result = [];
    let current = "";
    for (let i = 0; i < value.length; i++) {
        if (value[i] === -1) {
            result.push(current);
            current = "";
            continue;
        }
        current += String.fromCharCode(value[i]);
    }
    if (value.length > 0) { result.push(current) }
    return result;
}

function imageArrayToNumberArray(value: Array<Image>): Array<number> {
    let result: Array<number> = [];
    for (let i = 0; i < value.length; i++) {
        result = result.concat([value[i].width, value[i].height]);
        result = result.concat(imageToArray(value[i]));
        if (i < value.length - 1) {
            result.push(-1);
        }
    }
    return result;
}

function numberArrayToImageArray(value: Array<number>): Array<Image> {
    let result: Array<Image> = [];
    let imageData: Array<number> = [];
    let currentImage: Image;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === -1) {
            currentImage = arrayToImage(imageData.slice(2), imageData[0], imageData[1])
            result.push(currentImage);
            imageData = [];
            continue;
        }
        imageData.push(value[i]);
    }
    currentImage = arrayToImage(imageData.slice(2), imageData[0], imageData[1])
    result.push(currentImage);
    return result;
}

//% block="BetterSettings"
//% groups='["Numbers", "Strings", "Booleans", "Images", "Arrays", "Operations"]'
namespace blockSettings {
    /**
     * Write a boolean value (T/F) to settings
     * @param name Name of the setting to set
     */
    //% blockId=block_settings_write_boolean
    //% block="set setting $name to boolean $value"
    //% weight=100 blockGap=8 group="Booleans"
    export function writeBoolean(name: string, value: boolean): void {
        settings.writeNumber(name, value == true ? 1 : 0);
    }

    /**
     * Read a boolean value (T/F) from settings
     * @param name Name of the setting to read
     */
    //% blockId=block_settings_read_boolean
    //% block="read setting $name as boolean"
    //% weight=90 blockGap=8 group="Booleans"
    export function readBoolean(name: string): boolean {
        let value = settings.readNumber(name);
        return value === 1 ? true : false;
    }

    /**
     * Write an image object to settings
     * @param name Name of the setting to set
     */
    //% blockId=block_settings_write_image
    //% block="set setting $name to image $value"
    //% value.shadow="screen_image_picker"
    //% weight=100 blockGap=8 group="Images"
    export function writeImage(name: string, value: Image): void {
        let width = value.width;
        let height = value.height;
        settings.writeNumberArray(name, [width, height].concat(imageToArray(value)));
    }

    /**
     * Read an image object from settings
     * @param name Name of the setting to read
     */
    //% blockId=block_settings_read_image
    //% block="read setting $name as image"
    //% weight=90 blockGap=8 group="Images"
    export function readImage(name: string): Image {
        let value = settings.readNumberArray(name);
        if (value === undefined) {
            return undefined;
        }
        if (value.length < 2) {
            throw "Settings error: Invalid image input";
        }
        let width = value[0];
        let height = value[1];
        let imageArray = value.slice(2);
        return arrayToImage(imageArray, width, height);
    }

    /**
     * Write a string array to settings
     * @param name Name of the setting to set
     */
    //% blockId=block_settings_write_string_array
    //% block="set setting $name to string array $value"
    //% weight=40 blockGap=8 group="Arrays"
    export function writeStringArray(name: string, value: Array<string>) {
        let result = stringToNumberArray(value);
        settings.writeNumberArray(name, result);
    }

    /**
     * Read a string array from settings
     * @param name Name of the setting to read
     */
    //% blockId=block_settings_read_string_array
    //% block="read setting $name as string array"
    //% weight=30 blockGap=8 group="Arrays"
    export function readStringArray(name: string): Array<string> {
        let value = settings.readNumberArray(name);
        if (value === undefined) {
            return undefined;
        }
        return stringFromNumberArray(value);
    }

    /**
     * Write a boolean array to settings
     * @param name Name of the setting to set
     */
    //% blockId=block_settings_write_boolean_array
    //% block="set setting $name to boolean array $value"
    //% weight=20 blockGap=8 group="Arrays"
    export function writeBooleanArray(name: string, value: Array<boolean>): void {
        let result = value.map((value, index) => {
            return value === true ? 1 : 0;
        })
        settings.writeNumberArray(name, result);
    }

    /**
     * Read a boolean array from settings
     * @param name Name of the setting to read
     */
    //% blockId=block_settings_read_boolean_array
    //% block="read setting $name as boolean array"
    //% weight=10 blockGap=8 group="Arrays"
    export function readBooleanArray(name: string): Array<boolean> {
        let value = settings.readNumberArray(name);
        if (value === undefined) {
            return undefined;
        }
        return value.map((value, index) => {
            return value === 0 ? true : false;
        })
    }

    /**
     * Write an image array to settings
     * @param name Name of the setting to set
     */
    //% blockId=block_settings_write_image_array
    //% block="set setting $name to image array $value"
    //% weight=9 blockGap=8 group="Arrays"
    export function writeImageArray(name: string, value: Array<Image>): void {
        let result = imageArrayToNumberArray(value);
        settings.writeNumberArray(name, result);
    }

    /**
     * Read an image array from settings
     * @param name Name of the setting to read
     */
    //% blockId=block_settings_read_image_array
    //% block="read setting $name as image array"
    //% weight=8 blockGap=8 group="Arrays"
    export function readImageArray(name: string): Array<Image> {
        let value = settings.readNumberArray(name);
        if (value === undefined) {
            return undefined;
        }
        return numberArrayToImageArray(value);
    }
}