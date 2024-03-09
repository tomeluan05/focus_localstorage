const html = document.querySelector('html')

// mudar a foto e cor de fundo
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')

// mudar titulos e botoes
const title = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')

// ativar musica
const musicaFocoInput = document.querySelector('#alternar-musica')
const musica = new Audio('/sons/luna-rise-part-one.mp3')
musica.loop = true;

// ativar o play
const playNoTemporizador  = new Audio('/sons/play.wav')

// ativar o pause
const pauseNoTemporizador  = new Audio('/sons/pause.mp3')

// ativar o final do temporizador
const fimDoTemporizador  = new Audio('/sons/beep.mp3')

// temporizador
let tempoDecorridoEmSegundos = 2.0;
let startPauseBt = document.querySelector('#start-pause')
let intervaloId = null;

// mudar texto do botao comecar/pausar
let iniciarOuPausarBt = document.querySelector('#start-pause span')
// mudar imagem do botao comecar/pausar
let imagemPlay = document.querySelector('.app__card-primary-butto-icon')

const tempoNaTela = document.querySelector('#timer')

// ativar musica
musicaFocoInput.addEventListener('change', ()=>{
    if(musica.paused){
        musica.play()
    }else{
        musica.pause()
    }
})

focoBt.addEventListener('click', ()=>{
    tempoDecorridoEmSegundos = 2.0
    alterarContexto('foco')
    focoBt.classList.add('active')
})

curtoBt.addEventListener('click', ()=>{
    tempoDecorridoEmSegundos = 300
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

longoBt.addEventListener('click', ()=>{
    tempoDecorridoEmSegundos = 900
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

function alterarContexto(contexto){
    mostrarTempo()
    botoes.forEach((contexto)=>{
        contexto.classList.remove('active')
    })

    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)

    switch(contexto){
        case 'foco':
            title.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
        break;

        case 'descanso-curto':
            title.innerHTML = `Que tal dar uma respirada,<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`
        break;

        case 'descanso-longo':
            title.innerHTML = `Hora de voltar a superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
        break;

        default:
            break;
    }
}

// temporizador
const contagemRegressiva = ()=>{
    if(tempoDecorridoEmSegundos <= 0){
        fimDoTemporizador.play()
        alert(`terminou`)
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'

        if(focoAtivo){
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }

        zerar()
        // TESTE
        tempoDecorridoEmSegundos = 6;
        return
    }
    tempoDecorridoEmSegundos -= 1
    console.log(tempoDecorridoEmSegundos)
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar(){
    if(intervaloId){
        pauseNoTemporizador.play()
        zerar()
        return;
    }
    playNoTemporizador.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    imagemPlay.setAttribute('src', '/imagens/pause.png')
    iniciarOuPausarBt.textContent = `Pausar`
}

function zerar(){
    clearInterval(intervaloId)
    imagemPlay.setAttribute('src', '/imagens/play_arrow.png')
    iniciarOuPausarBt.textContent = `Começar`
    intervaloId = null;
}

// funcao para mostrar o tempo
function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {
        minute: '2-digit',
        second: '2-digit'
    })
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()