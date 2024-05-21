const html = document.querySelector("html");
const botonesContexto = document.querySelectorAll(".app__card-button");
const clasesBotonesContexto = ["app__card-button--enfoque","app__card-button--corto","app__card-button--largo"];
const contextoHTML = ["enfoque","descanso-corto","descanso-largo"];
const botonMusica = document.querySelector("#alternar-musica");
const Cancion1 = new Audio('./sonidos/luna-rise-part-one.mp3');
const sonidoPausar = new Audio('./sonidos/pause.mp3');
const sonidoPlay = new Audio('./sonidos/play.wav');
const sonidoFinTemporizador = new Audio('./sonidos/beep.mp3');
const botonIniciarPausar = document.querySelector('#start-pause');
const temporizador = document.querySelector('#timer');
let idIntervalo = null;
let reiniciarTemporizador = true;


botonIniciarPausar.addEventListener('click', () => {
    let tiempoTranscurrido = (parseInt(temporizador.textContent.replace(':','').substring(0,2))*60+parseInt(temporizador.textContent.replace(':','').substring(2,4)));

    botonesTemporizador();

    if(reiniciarTemporizador){
        reiniciarTemporizador = false;
        idIntervalo = setInterval( () => { 
            tiempoTranscurrido -= 1;
            temporizador.textContent = new Date(tiempoTranscurrido*1000).toLocaleTimeString('es-MX', { minute: "2-digit", second: "2-digit" });

            if(tiempoTranscurrido < 1){
                sonidoFinTemporizador.volume = 0.02;
                sonidoFinTemporizador.play();
                clearInterval(idIntervalo);
                idIntervalo = null;
            }
        }, 1000); 
    }
});

function botonesTemporizador (){
    sonidoPausar.volume = 0.1;
    sonidoPlay.volume = 0.1;
    if(document.querySelector('#start-pause span').textContent != "Pausar"){
        sonidoPlay.play();
        if(document.querySelector('#start-pause span').textContent == "Continuar"){
            reiniciarTemporizador = true;
        }
        document.querySelector('#start-pause span').textContent = "Pausar";
        document.querySelector('.app__card-primary-butto-icon').src = "/imagenes/pause.png";
        document.querySelector('#restart').style.display = "inline";
    }else{
        
        sonidoPausar.play();
        clearInterval(idIntervalo);
        document.querySelector('#start-pause span').textContent = "Continuar";
        document.querySelector('.app__card-primary-butto-icon').src = "/imagenes/play_arrow.png";
        reiniciarTemporizador = false;
    }
    const restart = document.querySelector('#restart');
    restart.addEventListener('click', () => {
        sonidoPausar.play();
        botonesContexto.forEach(element => {
            element.classList.contains("active") ? getContexto(element) : null
        });
    });
    
}


// Si pesionas el check box activa o reinicia la cancion actual
botonMusica.addEventListener('change',() => { 
    Cancion1.paused ? Cancion1.play() : Cancion1.pause(); 
    if(Cancion1.paused){
        // let restart = prompt('¿Quieres reiniciar la cancion?');
        Cancion1.currentTime = 0;
    }
});

// Obtenemos el boton que fue presionado para saber si es enfoque, descanso corto o largo, y agrega o elimina la clase active para pintar el fondo del boton
function getButtonClass() {
    botonesContexto.forEach((button) => {
        button.onclick = () => {
            botonesContexto.forEach(btn => btn.classList.remove("active"));
            getContexto(button);
            button.classList.add("active");
        };
    });
}

// cambia el texto del h1, el color y la imagen principal segun el contexto
function getContexto (botonClass){
    // Trae el h1 que contiene el texto principal de la pagina para editarlo de acuerdo al contexto
    const title = document.querySelector(".app__title");
    clearInterval(idIntervalo);
    idIntervalo = null;
    reiniciarTemporizador = true;
    document.querySelector('#start-pause span').textContent = "Comenzar";
    document.querySelector('.app__card-primary-butto-icon').src = "/imagenes/play_arrow.png";
    document.querySelector('#restart').style.display = "none";

    for(index = 0; index < clasesBotonesContexto.length; index++){
        if(clasesBotonesContexto[index] == botonClass.classList[1]){
            html.setAttribute("data-contexto",contextoHTML[index]);
            document.querySelector(".app__image").src = `/imagenes/${contextoHTML[index]}.png`;
            
            // Cambia los textos del html segun el boton contexto seleccionado
            switch(contextoHTML[index]){
                case "enfoque":
                    title.innerHTML = `Optimiza tu productividad,<br>
                    <strong class="app__title-strong">sumérgete en lo que importa.</strong>`;
                    temporizador.innerHTML = `${new Date(1*1000).toLocaleTimeString('es-MX', { minute: "2-digit", second: "2-digit" })}`;
                    
                break;
                case "descanso-corto":
                    title.innerHTML = `¿Qué tal tomar un respiro?<br>
                    <strong class="app__title-strong">¡Haz una pausa corta!</strong>`;
                    temporizador.innerHTML = `${new Date(300*1000).toLocaleTimeString('es-MX', { minute: "2-digit", second: "2-digit" })}`;
                    
                break;
                default:
                    title.innerHTML = `Hora de volver a la superficie<br>
                    <strong class="app__title-strong">Haz una pausa larga.</strong>`;
                    temporizador.innerHTML = `${new Date(900*1000).toLocaleTimeString('es-MX', { minute: "2-digit", second: "2-digit" })}`;
                    
            }
        } 
    }
}