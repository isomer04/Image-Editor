// Design, code, and test a WPF application that allows the user to perform the following tasks:

// 1. Select and load an image.
// 2. Draw one rectangle or more over the image by clicking and dragging the mouse to draw (the size of the rectangle depends on how much the user drags the mouse)
// 3. Only allow drawing inside the picture.
// 4. Change the rectangle's color by clicking each rectangle and selecting a different color from a color palette.
// 5. Resize the rectangle(s) from any corner or side.
// 6. Move the rectangle by pressing and holding the rectangle and moving the mouse (drag and drop).
// 7. Delete any rectangle.
// 8. Save the changes to a new image.

import  jsPDF  from "jspdf";


// Get the canvas and its context
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Set the canvas width and height
let canvasWidth, canvasHeight;
function setCanvasSize() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight - 100;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}
setCanvasSize();

// Load image
let image;
const imageInput = document.getElementById("imageInput");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const resizeButton = document.getElementById("resizeButton");
const downloadLink = document.getElementById("download-link");

imageInput.addEventListener("change", () => {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    };
    image.src = fileReader.result;
  };
  fileReader.readAsDataURL(imageInput.files[0]);
});

// Draw rectangle
let isDrawing = false;
let rectX, rectY, rectWidth, rectHeight;
let lastX = 0;
let lastY = 0;
let hue = 0;
let selectedRect = null;
let rectangles = [];


canvas.addEventListener("mousedown", (event) => {
  if (image) {
    isDrawing = true;
    rectX = event.clientX;
    rectY = event.clientY - 100;
  }
});
canvas.addEventListener("mousemove", (event) => {
  if (isDrawing) {
    rectWidth = event.clientX - rectX;
    rectHeight = event.clientY - 100 - rectY;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    rectangles.forEach((rectangle) => {
      context.beginPath();
      context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      context.fillStyle = rectangle.color;
      context.fill();
      context.strokeStyle = "#FF0000";
      context.lineWidth = 2;
      context.stroke();
    });
    context.beginPath();
    context.rect(rectX, rectY, rectWidth, rectHeight);
    context.strokeStyle = "#FF0000";
    context.lineWidth = 2;
    context.stroke();
  }
});
canvas.addEventListener("mouseup", () => {
  if (isDrawing) {
    isDrawing = false;
    rectangles.push({
      x: rectX,
      y: rectY,
      width: rectWidth,
      height: rectHeight,
      color: "#FF0000",
    });
  }
});



// Delete rectangle
// let deleteRect = false;
// canvas.addEventListener('click', (event) => {
// const mouseX = event.clientX;
// const mouseY = event.clientY - 100;
// if (rectX <= mouseX && mouseX <= rectX + rectWidth && rectY <= mouseY && mouseY <= rectY + rectHeight) {
// deleteRect = true;
// context.clearRect(0, 0, canvasWidth, canvasHeight);
// context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
// } else {
// deleteRect = false;
// }
// });

// canvas.addEventListener('click', (event) => {
//     const mouseX = event.clientX;
//     const mouseY = event.clientY - 100;
//     rectangles.forEach(rectangle => {
//       if (rectangle.x <= mouseX && mouseX <= rectangle.x + rectangle.width &&
//           rectangle.y <= mouseY && mouseY <= rectangle.y + rectangle.height) {
//         selectedRect = rectangle;
//       }
//     });
//   });

// // Save changes
let deleteRect = false;
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", () => {
  if (deleteRect) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  } else {
    const link = document.createElement("a");
    link.download = "newImage.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
});

// Save changes
// const saveButton = document.getElementById('saveButton');
// saveButton.addEventListener('click', () => {
//   if (deleteRect) {
//     // Remove the selected rectangle from the array
//     rectangles.splice(rectangles.indexOf(selectedRect), 1);
//     // Redraw the canvas without the selected rectangle
//     context.clearRect(0, 0, canvasWidth, canvasHeight);
//     context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
//     rectangles.forEach(rectangle => {
//       context.beginPath();
//       context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
//       context.fillStyle = rectangle.color;
//       context.fill();
//       context.strokeStyle = '#FF0000';
//       context.lineWidth = 2;
//       context.stroke();
//     });
//   } else {
//     const link = document.createElement('a');
//     link.download = 'newImage.png';
//     link.href = canvas.toDataURL('image/png');
//     link.click();
//   }
// });

// Change rectangle color
// canvas.addEventListener('click', (event) => {
//   const mouseX = event.clientX;
//   const mouseY = event.clientY - 100;
//   if (rectX <= mouseX && mouseX <= rectX + rectWidth && rectY <= mouseY && mouseY <= rectY + rectHeight) {
//     const color = prompt('Enter color:');
//     context.clearRect(0, 0, canvasWidth, canvasHeight);
//     context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
//     context.beginPath();
//     context.rect(rectX, rectY, rectWidth, rectHeight);
//     context.fillStyle = color;
//     context.fill();
//     context.strokeStyle = '#FF0000';
//     context.lineWidth = 2;
//     context.stroke();
//   }
// });

// Change rectangle color
canvas.addEventListener("click", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY - 100;
  rectangles.forEach((rectangle) => {
    if (
      rectangle.x <= mouseX &&
      mouseX <= rectangle.x + rectangle.width &&
      rectangle.y <= mouseY &&
      mouseY <= rectangle.y + rectangle.height
    ) {
      const color = prompt("Enter color:");
      rectangle.color = color;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      rectangles.forEach((rectangle) => {
        context.beginPath();
        context.rect(
          rectangle.x,
          rectangle.y,
          rectangle.width,
          rectangle.height
        );
        context.fillStyle = rectangle.color;
        context.fill();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 2;
        context.stroke();
      });
    }
  });
});

// Resize rectangle
let resize = false;
let resizeX, resizeY;
canvas.addEventListener("mousedown", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY - 100;
  if (
    rectX <= mouseX &&
    mouseX <= rectX + rectWidth &&
    rectY <= mouseY &&
    mouseY <= rectY + rectHeight
  ) {
    resize = true;
    resizeX = mouseX;
    resizeY = mouseY;
  }
});
canvas.addEventListener("mousemove", (event) => {
  if (resize) {
    const mouseX = event.clientX;
    const mouseY = event.clientY - 100;
    const widthDiff = mouseX - resizeX;
    const heightDiff = mouseY - resizeY;
    rectWidth += widthDiff;
    rectHeight += heightDiff;
    rectX -= widthDiff / 2;
    rectY -= heightDiff / 2;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    context.beginPath();
    context.rect(rectX, rectY, rectWidth, rectHeight);
    context.strokeStyle = "#FF0000";
    context.lineWidth = 2;
    context.stroke();
  }
});

canvas.addEventListener("mouseup", () => {
  resize = false;
});

function resizeImage(scale) {
  const scaledWidth = canvasWidth * scale;
  const scaledHeight = canvasHeight * scale;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
  rectangles.forEach((rectangle) => {
    context.beginPath();
    context.rect(
      rectangle.x * scale,
      rectangle.y * scale,
      rectangle.width * scale,
      rectangle.height * scale
    );
    context.fillStyle = rectangle.color;
    context.fill();
    context.strokeStyle = "#FF0000";
    context.lineWidth = 2;
    context.stroke();
  });
}

const imageSizeSlider = document.getElementById("imageSize");
imageSizeSlider.addEventListener("input", () => {
  const scale = imageSizeSlider.value;
  resizeImage(scale);
});

// image resizer

// resizeButton.addEventListener('click', () => {
//   const image = new Image();
//   const file = imageInput.files[0];
//   const width = parseInt(widthInput.value);
//   const height = parseInt(heightInput.value);

//   if (!file || !width || !height) {
//     alert('Please fill in all fields.');
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = () => {
//     image.src = reader.result;
//     image.onload = () => {
//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(image, 0, 0, width, height);
//     };
//   };
//   reader.readAsDataURL(file);
// });

// resizeButton.addEventListener('click', () => {
//     const image = new Image();
//     image.src = imageInput.files[0]; // replace with your image source

//     image.onload = () => {
//       const width = parseInt(widthInput.value);
//       const height = parseInt(heightInput.value);
//       canvas.width = width;
//       canvas.height = height;
//       context.drawImage(image, 0, 0, width, height);
//       canvas.toBlob((blob) => {
//         const url = URL.createObjectURL(blob);
//         downloadLink.href = url;
//       }, 'image/png'); // replace with desired format
//     };
//   });

const form = document.getElementById("image-form");
const galleryContainer = document.getElementById('image-gallery');
const carouselInner = document.getElementsByClassName('carousel-inner');




form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fileInput = document.getElementById("imageInput");
  const widthInput = document.getElementById("width-input");
  const heightInput = document.getElementById("height-input");
  const colorInput = document.getElementById("color-input");

  const file = fileInput.files[0];

  // Create an <img> element
  const imgElement = document.createElement('img');

  // Set the src attribute to the uploaded file
  imgElement.src = URL.createObjectURL(file);

  console.log(imgElement.src);

  console.log(URL.createObjectURL(file) + " img src")
  
  let imageWithElements = `<div class="carousel-item">
  <img src="${URL.createObjectURL(file)}" alt="First slide">
</div>`;


// Create a new element from the HTML string
const newElement = document.createElement('div');
newElement.innerHTML = imageWithElements;

// Append the new element to the carousel inner
carouselInner.appendChild(newElement.firstChild);

// carouselInner.appendChild(imageWithElements);


 
    // carouselInner.innerHTML=imageWithElements;

  

  // Add the <img> element to the gallery container
  galleryContainer.appendChild(imgElement);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.onload = () => {
    canvas.width = widthInput.value;
    canvas.height = heightInput.value;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // const data = imageData.data;

    // // Get the selected color
    // const selectedColor = hexToRgb(colorInput.value);

    // // Loop through every pixel and change its color
    // for (let i = 0; i < data.length; i += 4) {
    //   const r = data[i];
    //   const g = data[i + 1];
    //   const b = data[i + 2];

    //   // Calculate the grayscale value of the pixel
    //   const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    //   // Change the pixel color to the selected color
    //   data[i] = gray + selectedColor.r;
    //   data[i + 1] = gray + selectedColor.g;
    //   data[i + 2] = gray + selectedColor.b;
    //   //data[i + 3] is alpha, which we are not changing here
    // }

    ctx.putImageData(imageData, 0, 0);

    const dataUrl = canvas.toDataURL(file.type);

    const link = document.createElement("a");
    link.download = file.name;
    link.href = dataUrl;
    link.click();
  };
  image.src = URL.createObjectURL(file);
});

// Helper function to convert hex color to rgb
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return {
    r: r,
    g: g,
    b: b,
  };
}

// const colorPicker = document.getElementById('color-picker');

// colorPicker.addEventListener('input', (event) => {
//   const color = event.target.value;
//   console.log('Selected color:', color);
//   // use the selected color for image manipulation or other purposes
// });


// //draw

// canvas.addEventListener('mousedown', startDrawing);
// canvas.addEventListener('mousemove', draw);
// canvas.addEventListener('mouseup', stopDrawing);
// canvas.addEventListener('mouseout', stopDrawing);

// function startDrawing(event) {
//   isDrawing = true;
//   [lastX, lastY] = [event.offsetX, event.offsetY];
// }

// function draw(event) {
//   if (!isDrawing) return;
  
//   ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
//   ctx.lineCap = 'round';
//   ctx.lineWidth = 10;
  
//   ctx.beginPath();
//   ctx.moveTo(lastX, lastY);
//   ctx.lineTo(event.offsetX, event.offsetY);
//   ctx.stroke();
  
//   [lastX, lastY] = [event.offsetX, event.offsetY];
//   hue++;
// }

// function stopDrawing() {
//   isDrawing = false;
// }




function convertToPdf ()  {
  const text = document.getElementById('text-input').value;

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Add the text to the PDF document
  doc.text(text, 10, 10);

  // Save the PDF document to a file
  doc.save("my-document.pdf");
}
