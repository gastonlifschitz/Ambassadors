const service = {};

// TODO: Si se llama varias veces a show no anda muy bien esto, hay que cancelar los timeout.
// Por ahora sirve si no vuelven loco al servicio
const hide = element => {
  element.style['-webkit-animation'] = '';
  element.style.animation = '';
  element.style.visibility = 'hidden';
};

const show = (element, animationDuration) => {
  const fadeIn = 0.5;
  const fadeOut = animationDuration - fadeIn;
  element.style['-webkit-animation'] = `fadein ${fadeIn}s, fadeout ${fadeIn}s ${fadeOut}s`;
  element.style.animation = `fadein ${fadeIn}s, fadeout ${fadeIn}s ${fadeOut}s`;
  element.style.visibility = 'visible';
};

service.show = (id, duration = 4000) => {
  const snack = document.getElementById(id);

  if (snack) {
    show(snack, duration / 1000.0);
    setTimeout(() => {
      hide(snack); 
    }, duration);  
  }
};

service.hide = id => {
  const snack = document.getElementById(id);
  if (snack)
    hide(snack);
};

export default service;
