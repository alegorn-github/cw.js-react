import { getNumberWord } from "./getNumberWord";

export function getTimePhrase(timeS:number,format:'shortest'|'short'|'long'='short'){
    const hoursNames = ['часа','часов','часов'];
    const minutesNames = ['минуты','минут','минут'];
    if (format === 'short'){
        hoursNames.fill('час');
        minutesNames.fill('мин');
    }
    else if (format === 'shortest'){
        hoursNames.fill('ч');
        minutesNames.fill('м');
    }
    const hours = Math.trunc(timeS / 3600);
    const minutes = Math.trunc((timeS % 3600)/60);
    return `${hours > 0? `${hours} ${getNumberWord(hours,hoursNames)} `: ''}${minutes} ${getNumberWord(minutes,minutesNames)}`;

}
