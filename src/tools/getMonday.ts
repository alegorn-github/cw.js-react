export function getMonday(now:Date){
    const monday = (new Date(now.getFullYear(),now.getMonth(),now.getDate() - now.getDay() + (now.getDay() ? 1 : -6)));
    return (monday.getTime() - (new Date(now.getFullYear(),0,1)).getTime())/1000/60/60/24 + 1;
}
