const quantity_minus = document.getElementById('minus');
const quantity_plus = document.getElementById('plus');
const quantity_text = document.getElementById('quantity-text');

const carousel = document.getElementById('carousel');
const carousel_items = document.querySelectorAll('.carousel-item');
const carousel_prev = document.getElementById('prev');
const carousel_next = document.getElementById('next');

const addToCart = document.getElementById('add-to-cart');
const modal = document.getElementById('modal');
const modal_close = document.getElementById('modal-close');

const alert = document.getElementById('alert');
const alert_close = document.getElementById('alert-close');
const alert_text = document.getElementById('alert-text');

const pay = document.getElementById('pay');
const deleveryInfo = document.getElementById('delevery-info');

const paypalMessage = document.getElementById('paypal-message');

const infoName = document.getElementById('name');
const infoLastName = document.getElementById('last-name');
const infoEmail = document.getElementById('email');
const infoStreet = document.getElementById('street');
const infoColony = document.getElementById('colony');
const infoReference = document.getElementById('reference');
const infoCity = document.getElementById('city');
const infoState = document.getElementById('state-select');
const infoZip = document.getElementById('zip');

let quantity = 1;

quantity_minus.addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        quantity_text.innerHTML = quantity;
    }
});

quantity_plus.addEventListener('click', () => {
    if(quantity < 50){
        quantity++;
        quantity_text.innerHTML = quantity;
    }
});

// codigo para el carousel
let carousel_index = 0;
carousel_items[carousel_index].classList.add('active');

carousel_prev.addEventListener('click', () => {
    carousel_items[carousel_index].classList.remove('active');
    carousel_index--;
    if(carousel_index < 0){
        carousel_index = carousel_items.length - 1;
    }
    carousel_items[carousel_index].classList.add('active');
});

carousel_next.addEventListener('click', () => {
    carousel_items[carousel_index].classList.remove('active');
    carousel_index++;
    if(carousel_index >= carousel_items.length){
        carousel_index = 0;
    }
    carousel_items[carousel_index].classList.add('active');
});


// codigo para el modal
addToCart.addEventListener('click', () => {
    if(!modal.classList.contains('active')) modal.classList.add('active');
});

modal_close.addEventListener('click', () => {
    if(modal.classList.contains('active')) modal.classList.remove('active');
});

pay.addEventListener('click', () => {
    if(!modal.classList.contains('active')) modal.classList.add('active');

    if(infoName.value === '' || infoLastName.value === '' || infoStreet.value === '' || infoColony.value === '' || infoReference.value === '' || infoCity.value === '' || infoState.value === ''){
        return;
    }
    if(!validateEmail(infoEmail.value)){
        showAlert('El correo electronico no es valido');
        return;
    }
    if(validateZip(infoZip.value)){
        showAlert('El codigo postal no es valido');
        return;
    }

    renderPay();
});

function validateZip(zip){
    // solo puede contener numeros y no ser mayor a cinco
    var re = /^[0-9]{5}$/;
    return !re.test(zip);
}

function validateEmail(email){
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function renderPay(){
    document.getElementById('pay-container').innerHTML = '';
    paypal.Buttons({
        style: {
            shape: 'pill',
            color: 'blue',
            layout: 'vertical',
            label: 'pay',
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: 64.99 * quantity
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                if(details.status === 'COMPLETED'){
                    sendOrderEmail(details.id, details.payer.name.given_name ? details.payer.name.given_name : infoName.value);
                }
            });
        },
        onCancel: function (data) {
            showAlert('Lamentamos que no hayas podido completar la compra');
        },
        onError: function (err) {
            showAlert('Ha ocurrido un error inesperado');
        }
    }).render('#pay-container');
}

function showAlert(message){
    alert_text.innerHTML = message;
    if(!alert.classList.contains('active')) alert.classList.add('active');
}

alert_close.addEventListener('click', () => {
    if(alert.classList.contains('active')) alert.classList.remove('active');
});

function sendOrderEmail(orderId, name){
    Email.send({
        Host: "smtp.elasticemail.com",
        Username : "hello@ruanmiga.social",
        Password : "EFC0A11928E8ED327F2197FC1D570209921F",
        To : "antoniomirabal59@gmail.com",
        From : "Ruanmiga New Order <hello@ruanmiga.social>",
        Subject : "New order from " + infoName.value,
        Body : "Nombres: " + infoName.value + "<br>" +
        "Apellidos: " + infoLastName.value + "<br>" +
        "Email: " + infoEmail.value + "<br>" +
        "Calle y Numero: " + infoStreet.value + "<br>" +
        "Colonia: " + infoColony.value + "<br>" +
        "Referencia: " + infoReference.value + "<br>" +
        "Ciudad: " + infoCity.value + "<br>" +
        "Estado: " + infoState.value + "<br>" +
        "Codigo Postal: " + infoZip.value + "<br>" +
        "Cantidad: " + quantity + "<br>" +
        "Order Id: " + orderId + "<br>"
    }).then(
        message => {
            if(message === 'OK'){
                sendConsumerEmail(orderId, name);
            }else{
                console.error(message);
            }
        }
    );
}

function sendConsumerEmail(orderId, name){
    Email.send({
        Host: "smtp.elasticemail.com",
        Username : "hello@ruanmiga.social",
        Password : "EFC0A11928E8ED327F2197FC1D570209921F",
        To : infoEmail.value,
        From : "Ruanmiga - Mig Switch <hello@ruanmiga.social>",
        Subject : "Tu compra de Mig Switch ha sido exitosa",
        Body : name + " Tu compra de " + quantity +
        " Unidades de Mig Switch ha sido exitosa, estamos a la espera de recibir las copias de mig Switch de los desarrolladores detras del proyecto para empezar a distribuirlas y tu seras uno de los primeros en tener tu Mig Switch en tus manos.<br /><br />Estamos tan ansiosos como tu. en cuanto recibamos las copias y te las enviemos te lo haremos saber enviandote un correo electronico.<br /><small>Por favor estar al pendiente de tu correo electronico.</small>",
    }).then(
        message => {
            if(message.toLowerCase() === 'ok'){
                console.log('Email sent to ' + infoEmail.value);
                showAlert('Gracias ' + name + ' por tu compra de ' + quantity + ' unidades de Mig Switch en cuanto empezemos a distribuir te avisaremos por correo cuando tu paquete este en camino. <br /><small>Por favor estar al pendiente de tu correo electronico es posible que tu servicio de correo lo marque como spam.</small>');
            }else{
                console.error(message);
            }
        }
    );
}
