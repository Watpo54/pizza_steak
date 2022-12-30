const input = document.querySelector("#input");
const image = document.querySelector("#image");
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const predictButton = document.querySelector("#button");
const clearButton = document.querySelector("#clear");
const message = document.querySelector("#message");
canvas.width = 224;
canvas.height = 224;
image.width = 224;
image.height = 224;
const classes = ["pizza", "steak"];
window.onload = async () => {
    model = await tf.loadLayersModel("model.json");
    input.addEventListener("change", () => {
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
            image.setAttribute("src", reader.result);
        })
        if (input.files[0]) {
            reader.readAsDataURL(input.files[0]);

        } else {
            image.removeAttribute("src");
        }
    });
    image.addEventListener("load", () => {
        context.drawImage(image, 0, 0, 224, 224);
    });
    predictButton.addEventListener("click", async () => {
        if(image.src){
            const data = context.getImageData(0, 0, 224, 224);
            const preprocessedImage = [];
            for(let i = 0; i < data.data.length; i+=4){
                preprocessedImage.push(data.data[i] / 255);
                preprocessedImage.push(data.data[i + 1] / 255);
                preprocessedImage.push(data.data[i + 2] / 255);
            }
            const tensor = tf.tensor(preprocessedImage, [224, 224, 3]);
            prediction = await model.predict(tensor.expandDims(0));
            message.textContent = classes[Math.round(prediction.dataSync()[0])];
        }
        else{
            message.textContent = "Please introduce an image";
        }
    });
    clearButton.addEventListener("click", () => {
        context.clearRect(0, 0, 224, 224);
        message.textContent = "";
        image.removeAttribute("src");
        input.value = null;
    })
}