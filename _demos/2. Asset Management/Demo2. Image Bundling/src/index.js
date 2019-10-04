import './main.css'
import MyImage from './icon.png'

var image = new Image();
image.src = MyImage;
document.body.appendChild(image);

console.log("app started 2!!");
console.log(MyImage);
