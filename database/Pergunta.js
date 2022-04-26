const Sequelize = require('sequelize') 

const connection = require('./database')

// Criando o model → estrutura de dados que representa a nossa tabela
// Usamos o connection.define('[nome da minha tabela]', {[aqui eu ponho o meu json]})
const Pergunta = connection.define('perguntas', {
    titulo: {
        type: Sequelize.STRING,                         // Diferença do tipo STRING para o tipo TEXT: STRING é apara textos curtos e TEXT é para textos longos
        allowNull: false // isso impede que esse campo receba valores nulos 
    }, 
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}) // vc ainda pode passar mais um segundo JSON de opções como 3º parâmetro, ou pode simplesmente não passar  


// Para de fato criar a tabela no banco:
Pergunta.sync({force: false}).then(() => {console.log('Tabela de Perguntas criada')}) // Isso vai sincronizar o que tá aqui com o banco de dados e esse force indica que ele não vai forçar a criação da tabela caso ela já exista, ou seja, ele não vai recriar a tabela 

// Eu preciso importar Pergunta lá no meu index.js para conseguir salvar as perguntas no meu banco de dados:
// Então vamos precisar dar um module.exports:

module.exports = Pergunta
