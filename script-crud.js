// encontrar o botão de adicionar tarefa
let btnAdicionarTarefa = document.querySelector('.app__button--add-task')
// pegar o formulario que sera preencchido
let formAdicionarTarefa = document.querySelector('.app__form-add-task')
// cancela a tarefa
let cancelarTarefa = document.querySelector('.app__form-footer__button--cancel')
// criar uma uL para armazenar os elementos na tela
let ulTarefas = document.querySelector('.app__section-task-list')
// INPUT QUE SERA ESCRITO A LISTA
let textArea = document.querySelector('.app__form-textarea')
let paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')

let btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
let btnRemoverTodas = document.querySelector('#btn-remover-todas')

// ARRAY PARA RECEBER OS ELEMENTOS DO LOCALSTORAGE
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

let tarefaSelecionada = null
let liTarefaSelecionada = null

// --------- EDITAR TAREFA - ATUALIZAR MODIFICACOES NO LOCALSTORAGE
function atualizarTarefas(){
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

// Funcao para criar o elemento da tarefa
function criarElementoTarefa(tarefa) {
    // cria um elemento li
    let li = document.createElement('li');
    // adiciona a classe ao li
    li.classList.add('app__section-task-list-item')

    // cria uma imagem svg
    const svg = document.createElement('svg')
    // coloca a imagem no svg
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
</svg>
    `
    // cria uma paragrafo
    const paragrafo = document.createElement('p')
    // coloca o texto do objeto descricao no paragrafo
    paragrafo.textContent = tarefa.descricao;
    // adiciona uma classe no paragrafo
    paragrafo.classList.add('app__section-task-list-item-description')

    // cria uma botao
    let botao = document.createElement('button')
    // adiciona uma classe a esse botao
    botao.classList.add('app_button-edit')

    // ---------------- EDITAR A TAREFA -----------------
    botao.onclick = ()=>{
        let novaDescricao = prompt('Qual é o novo nome da tarefa?')
        console.log(`Nova descrição da tarefa: ${novaDescricao}`)
        if(novaDescricao){
            paragrafo.textContent = novaDescricao
            tarefa.descricao = novaDescricao
            atualizarTarefas()
        }
    }

    // -------------- CANCELAR A TAREFA -----------------
    cancelarTarefa.onclick = ()=>{
        textArea.value = ''
        formAdicionarTarefa.classList.add('hidden')
    }
    // Ou

    // Crie uma função para limpar o conteúdo do textarea e esconder o formulário
    // const limparFormulario = () => {
        // Limpe o conteúdo do textarea
        // textArea.value = '';  
        // Adicione a classe 'hidden' ao formulário para escondê-lo
        // formularioTarefa.classList.add('hidden');  
    // }

// Associe a função limparFormulario ao evento de clique do botão Cancelar
// btnCancelar.addEventListener('click', limparFormulario);


    // cria a imagem
    let imagemBotao = document.createElement('img')
    // seta o atributo a imagem
    imagemBotao.setAttribute('src', '/imagens/edit.png')
    // coloca a imagem do botao no botao
    botao.append(imagemBotao)

    // coloca os elementos na li
    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    }else{
        li.onclick = ()=>{
            document.querySelectorAll('.app__section-task-list-item-active').forEach((elemento)=>{
                elemento.classList.remove('app__section-task-list-item-active')
            })
    
            if(tarefaSelecionada == tarefa){
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
    
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            li.classList.add('app__section-task-list-item-active')
        }
    }


    // retorna essa li que esta preenchida com o texto da tarefa
    return li
}

// ao clicar no botao, se o form estiver aberto ele fecha, se estiver fechado ele abre
btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden')
})

// ARMAZENA O ARRAY tarefas no LOCALSTORAGE
formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault()

    // OBJETO QUE SERÁ ADICIONADO OS ITENS DA LISTA
    let tarefa = {
        descricao: textArea.value
    }

    tarefas.push(tarefa)
    // transforma o objeto em string para que ele vá para o localstorage
    let elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textArea.value = ''
    formAdicionarTarefa.classList.add('hidden')
})

tarefas.forEach((tarefa)=>{
    let elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    console.log('teste'+ulTarefas)
})


// FINALIZAR TAREFA 
document.addEventListener('FocoFinalizado', ()=>{
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

// REMOVER TAREFAS
let removerTarefas = (somenteCompletas)=>{
    let seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    document.querySelectorAll(seletor).forEach((elemento)=>{
        elemento.remove()
    })

    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)