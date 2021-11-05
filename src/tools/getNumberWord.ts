export function getNumberWord(number:number,names:Array<string>){
    const lastDigit = number % 10;
    if (lastDigit === 0 || lastDigit >= 5){
        return names[2];
    }
    else if (lastDigit === 1){
        return names[0];
    }
    else {
        return names[1];
    }
}
