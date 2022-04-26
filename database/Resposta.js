const Sequelize = require('sequelize') 

const connection = require('./database') 

const Resposta = connection.define('respostas', {
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: { // A resposta fica salva em referência a um ID de uma pergunta → isso é o que se chama de relacionamento cru 
        type: Sequelize.INTEGER,
        allowNull: false
    }
    // Existem outras forma de fazer um relacionamento entre tabelas (associação)
    // vamos ver isso no próximo capítulo
})

Resposta.sync({force: false}).then(() => {console.log('Tabela de Respostas criada')}) 

module.exports = Resposta 