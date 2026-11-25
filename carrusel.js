const btnleft = document.querySelector('.btn-left'),
    btnright = document.querySelector('.btn-right'),
    slider = document.querySelector('#slider'),
    sliderSection = document.querySelectorAll('.slider-section');

 
    
 btnleft.addEventListener('click', e => moverIzquierda()); 
 btnright.addEventListener('click', e => moverDerecha());  

 let operacion = 0;
    counter = 0,
    widthImg = 100 / sliderSection.length;

function moverDerecha() {
    if (counter >= sliderSection.length-1) {
        counter= 0;
        operacion = 0;
        slider.style.transform = `translate(-${operacion}%)`;
        
    }else {
        counter++;  
        operacion = operacion + widthImg;
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "all ease .6s"
   }
}

function moverIzquierda() {
    counter --;
    if (counter < 0) {
        counter = sliderSection.length-1;
        operacion = widthImg * (sliderSection.length-1);
        slider.style.transform = `translate(-${operacion}%)`;
    } else {
        operacion = operacion - widthImg;
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "all ease .6s"
    }
    

}