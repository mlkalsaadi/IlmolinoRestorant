
window.alert = function (message , timeout= null) {
    const alert = document.createElement('div');
    const alertButton = document.createElement('button' );
    alertButton.innerText='';
    alert.appendChild(alertButton);
    alert.classList.add('alert');
    alert.setAttribute('style',` position:fixed ; top:100px ; left:10px ; color:red`

    );
    alert.innerText=message;
    document.body.appendChild(alert);
   
}