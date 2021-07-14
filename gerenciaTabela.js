function fabrica(tipo, filhos, texto, atributos) {
    let $el = document.createElement(tipo)

    if (texto) {
        $el.innerText = texto
    }

    if (atributos) {
        for (let [chave, valor] of Object.entries(atributos)) {
            $el.setAttribute(chave, valor)
        }
    }


    if (filhos) {
        if (Array.isArray(filhos)) {
            $el.append(...filhos)

        } else {
            $el.append(filhos)
        }

    }
    return $el
} 
(function (){
    let TIMES = []

function populaTimes(){   
    let nomesMock = ['A','B','C','D']
    for(let ii=0;ii<4;ii++){
       let tms = {
        nome:nomesMock[ii],
        pontos:0, 
        vitorias:0,
        empates:0,
        derrotas:0,
        } 
        TIMES.push(tms)
    }     
}


 
let PARTIDAS; 
let sequenciaTimesNasPartidas = [0,1,2,3,
                                  0,2,1,3,
                                  0,3,1,2]
function populaPartidas(PARTIDASraw){
 PARTIDAS = []
  for(let ii=0;ii<sequenciaTimesNasPartidas.length;ii++){
      let isImpar = ii % 2 !== 0
      if(isImpar){
          continue;
      }
      PARTIDAS.push({
          casa:TIMES[sequenciaTimesNasPartidas[ii]]          
      })

  }
  let yy=0;
  for(let partida of PARTIDAS){
      partida.vitoria = PARTIDASraw ? PARTIDASraw[yy]?.vitoria : ''
      partida.empate = PARTIDASraw  ? PARTIDASraw[yy]?.empate : ''
      partida.derrota = PARTIDASraw ? PARTIDASraw[yy]?.derrota : ''
      ++yy;
  }
  
  yy=0;
  for(let zz=0;zz<sequenciaTimesNasPartidas.length;zz++){
      let isImpar = zz % 2 !== 0
      if(isImpar){
          continue;
      }
      PARTIDAS[yy].visitante = TIMES[sequenciaTimesNasPartidas[zz+1]]
      ++yy;
  }

}

let paletaDeCores = ['green','yellow','red']

 
function linhaTabela(Nome, Pontos, Vitorias, Empates, Derrotas,
tipo='td',atributos) {
    let $linha = [ fabrica(tipo, null, Nome,atributos)  ]
    
    for(let ii=1;ii<4;ii++){
        if(arguments[ii] === 'x'){
            $linha.push(fabrica(tipo, null, '',{style:
            `background-color: ${paletaDeCores[ii-1]};`}))
        }else{
            $linha.push(fabrica(tipo, null, arguments[ii],atributos))
        }

    }

    $linha.push(fabrica(tipo, null, Derrotas,atributos))

    return $linha;
}
function fabricaCabecalhoDuplo(TituloTopo,TituloColunas){
    let $cabecalho = linhaTabela('', '',
        TituloTopo, '', '','th',{scope:"col"})
    let $cabecalho2 =
        linhaTabela(...TituloColunas,'th',{scope:"col"})
 

    let $linhasHEAD = [fabrica('tr', $cabecalho),
                        fabrica('tr', $cabecalho2)]
    let $tHead = fabrica('thead',$linhasHEAD)

    return $tHead
}

function fabricaTabelaGenerica(TituloTopo,TituloColunas,$linhasTBODY){
    let $tHead = fabricaCabecalhoDuplo(TituloTopo,TituloColunas)  
    let $tBody = fabrica('tbody',$linhasTBODY)
    let $tabela = fabrica('table', [$tHead,$tBody],'')
    
    return $tabela
}

function geraTabelaPartidas() {
    
    let $linhasTBODY = []

    for (let partida of PARTIDAS) {        
        let partidaAtual = linhaTabela(
        partida.casa.nome, partida.vitoria, partida.empate,
            partida.derrota, partida.visitante.nome);
        $linhasTBODY.push(fabrica('tr', partidaAtual))
    }
    
    let $tabelaPartidas =  fabricaTabelaGenerica('Partidas',
    ['casa', 'vitoria','empate', 'derrota da casa','visitante'],
    $linhasTBODY  )
    
    return $tabelaPartidas

}


function geraTabelaClassificacao() {
    let $linhasTBODY=[];

    for (let time of TIMES) {
        let timeAtual = linhaTabela(time.nome, time.pontos,
            time.vitorias, time.empates, time.derrotas)

        $linhasTBODY.push(fabrica('tr', timeAtual))

    }

    let $tabelaTimes = fabricaTabelaGenerica('Classificacao',
    ['Time', 'Pontos','Vitorias', 'Empates','Derrotas'],
    $linhasTBODY)

    return $tabelaTimes
}

 function encontraColunaLinhaAtual($linhaTDsDentroDoTR, $elementoClicado) {
        
        for (let [numeroColuna, $TD] of $linhaTDsDentroDoTR.entries()) {
            if ($TD === $elementoClicado) {
                return numeroColuna;
            }

        }
        return -1;

    }

    function localizacaoPartidaClicada($elementosTRdaTabela, colunaClicada) {
        
        for (let [indiceAtual, $TRlinhaInteira] of $elementosTRdaTabela.entries()) {
            let dentroDaLinha = $TRlinhaInteira.childNodes
            let numeroColunaClicada = encontraColunaLinhaAtual(dentroDaLinha,
                colunaClicada)
            
            if (numeroColunaClicada >= 0) {
                let linhaCorrespondentePartida = indiceAtual - 2
                return [linhaCorrespondentePartida,numeroColunaClicada]
            }
        }
        return -1;
    }

    function SelecionaOpcaoColunaPartida(coordenadasPartidaXcolunaY,
    $elementoClicado,$elementosTRdaTabela){
        let x = coordenadasPartidaXcolunaY[0]
        let y = coordenadasPartidaXcolunaY[1]
        let $linhaClicada = $elementoClicado.parentElement

        

        function removeOuAdicionaPontoTimes(multiplicaNegativoOuPositivo,
        partida,OpcaoColunaClicada){
            if(OpcaoColunaClicada==="vitoria"){
                partida.casa.pontos+=3*multiplicaNegativoOuPositivo
                partida.casa.vitorias+=1*multiplicaNegativoOuPositivo

                partida.visitante.derrotas+=1*multiplicaNegativoOuPositivo
            }
            if(OpcaoColunaClicada==="empate"){
                partida.casa.pontos+=1*multiplicaNegativoOuPositivo
                partida.casa.empates+=1*multiplicaNegativoOuPositivo

                partida.visitante.pontos+=1*multiplicaNegativoOuPositivo
                partida.visitante.empates+=1*multiplicaNegativoOuPositivo
            }
            if(OpcaoColunaClicada==="derrota"){
                partida.visitante.pontos+=3*multiplicaNegativoOuPositivo
                partida.visitante.vitorias+=1*multiplicaNegativoOuPositivo

                partida.casa.derrotas+=1*multiplicaNegativoOuPositivo
            }
        }
        function DeselecionaOutrasOpcoes(partida){
            let isTimeCasaVitorioso = partida["vitoria"] === 'x'
            let isTimesEmpate = partida["empate"] === 'x'
            let isDerrotaCasa = partida["derrota"] === 'x'

            if(isTimeCasaVitorioso){
                removeOuAdicionaPontoTimes(-1,partida,"vitoria")
                partida["vitoria"] = ''  
                $linhaClicada.cells[1].style.backgroundColor = ''
                return "vitoria";
            }
            if(isTimesEmpate){
                removeOuAdicionaPontoTimes(-1,partida,"empate")
                partida["empate"] = ''  
                $linhaClicada.cells[2].style.backgroundColor = '' 
                return "empate";
            }
            if(isDerrotaCasa){
                removeOuAdicionaPontoTimes(-1,partida,"derrota")                
                partida["derrota"] = ''
                $linhaClicada.cells[3].style.backgroundColor = ''  
                return "derrota";
            }
            return 'Nada Selecionado';
        }

        if(y >=1 && y <= 3){
            let ArrayCabecalhoAtributosPartida = Object.keys(PARTIDAS[x])
            let OpcaoColunaClicada = ArrayCabecalhoAtributosPartida[y]
 
            let opcaoPreviamenteSelecionada = 
                DeselecionaOutrasOpcoes(PARTIDAS[x])

            if(OpcaoColunaClicada !== opcaoPreviamenteSelecionada){
                removeOuAdicionaPontoTimes(1,PARTIDAS[x],OpcaoColunaClicada)
                PARTIDAS[x][OpcaoColunaClicada] = 'x'                    
                $elementoClicado.style.backgroundColor = paletaDeCores[y-1]
            } 
            
        }        
    }

function armazenaLocalStorage(){
    let partidasEmTexto = JSON.stringify(PARTIDAS)
    localStorage.setItem('PARTIDASgjAT',partidasEmTexto)
}
function recuperaLocalStorage(){
    let partidasEmTexto = localStorage.getItem('PARTIDASgjAT')
    if(!partidasEmTexto){
        return;
        
    }
    PARTIDASraw = JSON.parse(partidasEmTexto)
    TIMES = []
    TIMES.push(PARTIDASraw[0].casa)
    TIMES.push(PARTIDASraw[0].visitante)
    TIMES.push(PARTIDASraw[1].casa)
    TIMES.push(PARTIDASraw[1].visitante)
    populaPartidas(PARTIDASraw)
}

populaTimes()
populaPartidas()
recuperaLocalStorage()


let $ancora = document.querySelector("#ancora")
let $titulo = fabrica("h1", null, 'Assessment - JS - Gabriel Justino')
let $tabelaTopoInicial = geraTabelaClassificacao();
let $tabelaAbaixoInicial = geraTabelaPartidas();

 
function EstilizaBootstrap(){
    let estiloClass = "table table-striped  table-hover table-bordered"
    $tabelaAbaixoInicial.className = estiloClass
    $tabelaTopoInicial.className = estiloClass
}


function DesenhaPaginaHtml(deveLimpar=true){
    
    let $elementosAtualizar = [$titulo, $tabelaTopoInicial,
                         $tabelaAbaixoInicial]
    if(deveLimpar){
        for(let $elemento of $elementosAtualizar){            
            $ancora.removeChild($elemento)    
        }
        $tabelaTopoInicial = geraTabelaClassificacao()
        $elementosAtualizar[1] = $tabelaTopoInicial
                           
    }     
    
    $ancora.append(...$elementosAtualizar);
    EstilizaBootstrap()
}



function gerenciaTodasTabelas(evento){
        
    let $elementoClicado = evento.target
    let $tabelaPartidas = $elementoClicado.offsetParent
    let $linhasDaTabela = $tabelaPartidas.rows
    let $elementosTRdaTabela = [...$linhasDaTabela]
    
        try{
            
        let coordenadasPartidaXcolunaY = localizacaoPartidaClicada($elementosTRdaTabela,
            $elementoClicado)
        
        if (coordenadasPartidaXcolunaY !== -1) {            
            let localizacaoDaPartida = coordenadasPartidaXcolunaY[0]            

            SelecionaOpcaoColunaPartida(coordenadasPartidaXcolunaY,
                         $elementoClicado,$elementosTRdaTabela)
            DesenhaPaginaHtml()
            armazenaLocalStorage()
            
            }    

        }catch(erou){
            console.log(`clicou errado meu consagrado: ${erou}`)
        }
    
}

$tabelaAbaixoInicial.addEventListener('click', gerenciaTodasTabelas)


DesenhaPaginaHtml(false)



})()
