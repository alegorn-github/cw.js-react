export function changeTheme(darkTheme:boolean){
    if (document instanceof Document){
        if (darkTheme){
          document.documentElement.style.setProperty('--white','#000000');
          document.documentElement.style.setProperty('--black','#ffffff');
          document.documentElement.style.setProperty('--gray-dark-33','#cccccc');
          document.documentElement.style.setProperty('--gray-99:','#666666');
          document.documentElement.style.setProperty('--gray-light-C4','#3b3b3b');
          document.documentElement.style.setProperty('--gray-lightest-E4','#1b1b1b');
          document.documentElement.style.setProperty('--gray-lightest-F4','#0b0b0b');
          document.documentElement.style.setProperty('--gray-lightest-D4','#212121');
          document.documentElement.style.setProperty('--gray-lightest-EC','#131313');
          document.documentElement.style.setProperty('--red','#23c1dd');
          document.documentElement.style.setProperty('--red-dark','#48d7f0');
          document.documentElement.style.setProperty('--red-light','#157686');
          document.documentElement.style.setProperty('--green','#5749b0');
          document.documentElement.style.setProperty('--orange','#002256');
          document.documentElement.style.setProperty('--purple','#202301');
          document.documentElement.style.setProperty('--blue','#3a0e00');
          document.documentElement.style.setProperty('--green-dark','#766bbe');
          document.documentElement.style.setProperty('--orange-dark','#0051ca');
          document.documentElement.style.setProperty('--purple-dark','#636828');
          document.documentElement.style.setProperty('--blue-dark','#636828');
        }
        else {
          document.documentElement.style.setProperty('--white','#ffffff');
          document.documentElement.style.setProperty('--black','#000000');
          document.documentElement.style.setProperty('--gray-dark-33','#333333');
          document.documentElement.style.setProperty('--gray-99:','#999999');
          document.documentElement.style.setProperty('--gray-light-C4','#C4C4C4');
          document.documentElement.style.setProperty('--gray-lightest-E4','#E4E4E4');
          document.documentElement.style.setProperty('--gray-lightest-F4','#F4F4F4');
          document.documentElement.style.setProperty('--gray-lightest-D4','#DEDEDE');
          document.documentElement.style.setProperty('--gray-lightest-EC','#ECECEC');
          document.documentElement.style.setProperty('--red','#DC3E22');
          document.documentElement.style.setProperty('--red-dark','#B7280F');
          document.documentElement.style.setProperty('--red-light','#EA8979');
          document.documentElement.style.setProperty('--green','#A8B64F');
          document.documentElement.style.setProperty('--orange','#FFDDA9');
          document.documentElement.style.setProperty('--purple','#DFDCFE');
          document.documentElement.style.setProperty('--blue','#C5F1FF');
          document.documentElement.style.setProperty('--green-dark','#899441');
          document.documentElement.style.setProperty('--orange-dark','#FFAE35');
          document.documentElement.style.setProperty('--purple-dark','#9C97D7');
          document.documentElement.style.setProperty('--blue-dark','#7FC2D7');
        }
      }
}