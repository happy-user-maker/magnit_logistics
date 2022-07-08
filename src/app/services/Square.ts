// @ts-ignore
export const squares = createArray(50, 50);

// const topLeftRigtBottom = [52.1, 38.0... ];


squaresInit();

export function squaresInit() {

}

// https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length: number) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        const args = Array.prototype.slice.call(arguments, 1);
        //@ts-ignore
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}
