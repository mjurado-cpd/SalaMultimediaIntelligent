/*Opció videotrucada*/
function obrirTeamsNovaReunio() {
    const popup = document.getElementById("teams-popup");
    const countdown = document.getElementById("countdown");
	
    //Mostrar popup
    popup.style.display = "flex";
	let segons = 5;
	countdown.innerText = "Obrint en " + segons + " segons...";

    //Interval compte enrere
    const interval = setInterval(() => {
		segons--;
        countdown.innerText = "Obrint en " + segons + " segons...";
		if (segons <= 0) {
			clearInterval(interval);
			
			//Amagar popup
			popup.style.display = "none";
			
			//Obrir Teams
			window.location.href = "msteams://";
		}
	}, 1000);
}

/*Opció Projecció de documentació*/
function obrirOffice() {
	const popup = document.getElementById("office-popup");
	const countdown = document.getElementById("office-countdown");
	
	//Mostrar popup
	popup.style.display = "flex";
	let segons = 5;
	countdown.innerText = "Obrint Office en " + segons + " segons...";
	
	//Interval compte enrere
	const interval = setInterval(() => {
		segons--;
        countdown.innerText = "Obrint Office en " + segons + " segons...";
        if (segons <= 0) {
			clearInterval(interval);
			
			//Amagar popup
			popup.style.display = "none";

            //Obrir Office online
			window.open("https://login.microsoftonline.com/", "_blank");
		}
    }, 1000);
}

/*Opció videotrucada amb Projecció de documentació*/
function obrirVideotrucadaProjectada() {
    const popup = document.getElementById("combo-popup");
    const countdown = document.getElementById("combo-countdown");
	
	//Mostrar popup
	popup.style.display = "flex";
	let segons = 5;
    countdown.innerText = "Iniciant sistema en " + segons + " segons...";
	
	//Interval compte enrere
    const interval = setInterval(() => {
		segons--;
        countdown.innerText = "Iniciant sistema en " + segons + " segons...";
	}, 1000);
	
    //Interval compte enrere
    setTimeout(() => {
		clearInterval(interval);
        popup.style.display = "none";
        
		//Obrir Teams
        window.location.href = "msteams://";
		
		//Obrir Office després
        setTimeout(() => {
			window.open("https://login.microsoftonline.com/", "_blank");
		}, 2500);
    }, 5000);
}

function seleccionarMode(mode) {
	alert("Mode seleccionat: " + mode);
}

/*Avís reoportar incidència*/
function reportarIncidencia(tipus) {
	const descripcio = document.getElementById("descripcio").value;
    const dataActual = new Date().toLocaleString();
	const sala = "Sala Multimèdia 1";
    const assumpte = "Incidència - " + tipus;
    const cos = "S'ha detectat una incidència.\n\n" +
		  "Sala: " + sala + "\n" +
		  "Data: " + dataActual + "\n" +
		  "Dispositiu: " + tipus + "\n\n" +
		  "Descripció:\n" + descripcio;
	const outlookURL = "https://outlook.office.com/mail/deeplink/compose" +
		  "?to=suport@hospital.cat" +  /*Aquí s'introduirà el mail concret per les incidencies i que genera un ticket real i automàtic al enviar-lo*/
		  "&subject=" + encodeURIComponent(assumpte) +
		  "&body=" + encodeURIComponent(cos);
	window.open(outlookURL, "_blank");
}

/*AVÍS DE CONTROL DE DISPOSITIU*/
function controlDispositiu(dispositiu) {
	alert("Acció enviada al dispositiu: " + dispositiu);
	const resultat = document.getElementById("resultat");
	resultat.textContent = "S'ha iniciat correctament la prova del dispositiu: " + dispositiu;
}

function simularAccio(text) {
	alert("S'ha iniciat: " + text);
}

/*Control càmera*/
let stream = null;
let cameraActiva = false;

async function activarCamera() {
	const video = document.getElementById("video");
		if (!cameraActiva) {
			try {
				stream = await navigator.mediaDevices.getUserMedia({ video: true });
				video.srcObject = stream;
				video.style.display = "block";
				cameraActiva = true;
				document.getElementById("resultat").innerText = "Càmera activada";
			} catch (error) {
				console.error(error);
			}
		} else {
			//Apagar càmera
			stream.getTracks().forEach(track => track.stop());
			video.srcObject = null;
			video.style.display = "none";
			cameraActiva = false;
			document.getElementById("resultat").innerText = "Càmera desactivada";
		}
}

/*Control microfon*/
let micStream = null;
let microActiu = false;
let audioContext;
let analyser;
let dataArray;
let animationId;

async function activarMicrofon() {
    const level = document.getElementById("mic-level");
    const img = document.getElementById("mic-img");

    if (!microActiu) {
        try {
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(micStream);

            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;

            source.connect(analyser);

            dataArray = new Uint8Array(analyser.frequencyBinCount);

            microActiu = true;
            img.src = "img/micro.jpg";
			
            //Mostrar barra de so
            level.style.display = "block";

            document.getElementById("resultat").innerText = "Micro activat";

            function update() {
                analyser.getByteFrequencyData(dataArray);

                let sum = dataArray.reduce((a, b) => a + b, 0);
                let avg = sum / dataArray.length;

                level.style.height = (avg * 2) + "px";

                animationId = requestAnimationFrame(update);
            }

            update();

        } catch (error) {
            console.error(error);
        }
    } else {
		// Aturar micro
		micStream.getTracks().forEach(track => track.stop());
        cancelAnimationFrame(animationId);

        level.style.height = "10px";
        microActiu = false;        
        img.src = "img/micro.jpg";

        //Amagar barra
        level.style.display = "none";

        document.getElementById("resultat").innerText = "Micro desactivat";
    }
}
/*Control Pantalla*/

let pantallaActiva = false;

function activarPantalla() {
	const img = document.getElementById("screen-img");
	
    if (!pantallaActiva) {
		img.src = "img/cartaajust.jpg"; // la teva carta bona
        document.getElementById("resultat").innerText = "Carta d'ajust activada";
        pantallaActiva = true;
    } else {
        img.src = "img/pantalla.jpg"; // pantalla apagada
        document.getElementById("resultat").innerText = "Carta d'ajust desactivada";
        pantallaActiva = false;
    }
}

/*Control altaveu+micro*/
let audioCtx;
let micStreamAltaveus;
let sourceNode;
let gainNode;
let analyserAltaveus;
let animationIdAltaveus;
let altaveusActius = false;

async function activarAltaveus() {

    const level = document.getElementById("mic-level");

    if (!altaveusActius) {

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        //Beep
        const oscillator = audioCtx.createOscillator();
        const beepGain = audioCtx.createGain();
		oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        beepGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        oscillator.connect(beepGain);
        beepGain.connect(audioCtx.destination);
        oscillator.start();
        document.getElementById("resultat").innerText = "Test d'altaveus iniciat...";

        //Després del beep
        setTimeout(async () => {

            oscillator.stop();
			try {
				micStreamAltaveus = await navigator.mediaDevices.getUserMedia({ audio: true });
                sourceNode = audioCtx.createMediaStreamSource(micStreamAltaveus);
				
                gainNode = audioCtx.createGain();
                gainNode.gain.value = 0.5;

                analyserAltaveus = audioCtx.createAnalyser();
                analyserAltaveus.fftSize = 256;

                sourceNode.connect(analyserAltaveus);
                analyserAltaveus.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                const dataArray = new Uint8Array(analyserAltaveus.frequencyBinCount);

                function updateLevel() {
					analyserAltaveus.getByteFrequencyData(dataArray);

                    let sum = dataArray.reduce((a, b) => a + b, 0);
                    let avg = sum / dataArray.length;

                    level.style.height = (avg * 2) + "px";

                    animationIdAltaveus = requestAnimationFrame(updateLevel);
                }

                updateLevel();

                document.getElementById("resultat").innerText = "Parla pel micro...";

            } catch (error) {
                console.error(error);
            }

        }, 2000);

        altaveusActius = true;

    } else {
        //Stop

        if (micStreamAltaveus) {
            micStreamAltaveus.getTracks().forEach(track => track.stop());
        }
        if (audioCtx) {
            audioCtx.close();
        }
        cancelAnimationFrame(animationIdAltaveus);
        level.style.height = "10px";

        altaveusActius = false;
        document.getElementById("resultat").innerText = "Prova d'altaveus aturada";
    }
}

/*Test General*/
let testGeneralActiu = false;

async function testGeneral() {

    const resultat = document.getElementById("resultat");
    if (!testGeneralActiu) {
        resultat.innerText = "Iniciant test general...";

        //Activació per parts
        activarPantalla();
		
        setTimeout(() => activarCamera(), 500);
        setTimeout(() => activarMicrofon(), 800);
		setTimeout(() => activarAltaveus(), 1200);
		
        testGeneralActiu = true;

    } else {

        //Aturar tot
        if (pantallaActiva) activarPantalla();
        if (cameraActiva) activarCamera();
        if (altaveusActius) activarAltaveus();

        resultat.innerText = "Test general finalitzat";

        testGeneralActiu = false;
    }
}