const express = require('express')
const app = express()
const bodyParser = require('body-parser') // traduz os dado enviados pelo formulário em uma estrutura JS que a gente consiga usar no backend 
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta') // só pelo fato do model está sendo importado aqui no meu arquivo index.js, o código dele já é executado toda vez, fazendo com que ele crie a tabela
const Resposta = require('./database/Resposta')

// Database 
connection 
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados')
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

// configurando a view engine e definindo a pasta em que os nosso arquivos estáticos estarão
app.set('view engine', 'ejs')
app.use(express.static('public'))

// Body parser
app.use(bodyParser.urlencoded({extended: false})) // Isso permite com que a pessoa envie os dados do formulário e o bodyParser vai traduzir esses dados em uma estrutura JS para a gente usar aqui no noso backend 
app.use(bodyParser.json()) // isso permite que a gente leia dados de formulário enviados via JSON → isso só vai ser usado quando estivermos trabalhando com API 


// ROTAS:
// rota principal
app.get('/',(req, res)=> {
    // Para ordernar as nossas perguntas da mais recente para a mais antiga, vamos usar o id delas para isso
    // Então adicionamos ao objeto que foi passado como parâmetro para o método findAll, a chave order e no valor dela nós passamos um Array que tem outro Array com o campo que eu quero usar como base para ordenar e se eu quero crescente ou decrescente:
    // [['id', 'DESC']]
    Pergunta.findAll({raw: true, order: [
        ['id', 'DESC'] // ASC => Crescente e DESC => Decrescente
    ]}).then(perguntas => {
        // console.log(perguntas) // Repara aqui no console que em perguntas não tem só as perguntas, mas também um monte de informações adicionais
        // Para não ficar com essas informações adicionais, podemos passar um objeto para o nosso método findAll({raw: true}), então ele vai fazer uma pesquisa crua pelos dados e vai só trazer os dados e nada mais
        // Agora vamos precisar passar esses dados para o nosso front-end, portanto, precisamos enviar para nossa view index.ejs
        // Daí basta fazer aquele esquema de passar a variável perguntas para esse nosso index.ejs, da seguinte maneira: 
        res.render('index', { 
            perguntas : perguntas
        })
    })
    // Esse método findAll() é equivalente ao seguinte sql : 'SELECT * FROM perguntas
})

// Criando uma nova rota para página de perguntas
app.get('/perguntar', (req, res)=>{
    res.render('perguntar')
})

// Criando uma nova rota para receber os dados do formulário
// repara que aqui eu usei app.post e não app.get, pois como eu estou trabalhando com o método post lá no meu formulário, eu preciso usar post aqui também 
app.post('/salvarpergunta', (req, res)=> {
    // Pegando as informações de um formulário 
    let titulo = req.body.titulo
    let descricao = req.body.descricao 
    Pergunta.create({ // Esse método create é o reponsável por salvar uma pegunta no banco de dados (Equivalente ao: 'INSERT INTO perguntas (...) VALUES(...)')
       titulo: titulo,
       descricao: descricao  
    }).then(() => {   // Após salvar a pergunta com sucesso no meu banco de dados, eu vou querer redirecionar o meu usuário para a minha página principal
        res.redirect('/') // Usando essa função do express, eu devolvo como resposta, após a pergunta ter sido salva com sucesso no banco de dados, um redirecionamento para a página principal 
    })

})

// Criando a nova rota para a página de perguntas com um parametro obrigatório:
app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id 
    Pergunta.findOne({
        where: {id: id} // Aqui eu coloco o nome do campo que eu quero pesquisar e o valor do campo que eu quero comparar 
        // pra isso que serve o where, ele serve para fazer buscas através de condições 
    }).then(pergunta => { // quando a operação de busca for concluída, ele vai chamar esse then e vai passar a pergunta encontrada nessa variável pergunta
        if(pergunta != undefined){ // pergunta encontrada no banco de dados
            Resposta.findAll({ // Usando o findall, nós podemos pesquisar por perguntas onde o perguntaId é igual ao pergunta.id (q é o id especificado pela página de perguntas )
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']] 
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas  // passando as respostas para a minha view
                })
            })
        }else{ // Pergunta não encontrada no banco de dados
            res.redirect('/')
        }
    })
    // o método findOne() é um método do sequelize que vai buscar para a gente no banco de dados por UM dado 
    // E ele deve buscar um dado com uma condição, no nosso caso a condição é que eu quero achar uma pergunta que tenha id igual ao valor da minha variável id   
})

app.post('/responder', (req, res) => {
    let corpo = req.body.corpo // estamos pegando lá do body da requisição, o elemento cujo nome é corpo (que é justamente o corpo da minha reposta)
    let perguntaId = req.body.pergunta // mesma coisa aqui 

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/'+perguntaId)
    })
})

app.listen(5000,()=>{console.log('App rodando!')})