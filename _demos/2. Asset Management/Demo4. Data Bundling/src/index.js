import './main.css'
import MyImage from './icon.png'
import Data from './data.xml';

var image = new Image();
image.src = MyImage;
document.body.appendChild(image);

console.log("app started 2!!");
console.log(MyImage);
console.log(Data);
