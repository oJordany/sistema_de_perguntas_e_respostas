const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'pass', { // 'guiaperguntas' é o nome do meu banco de dados que eu criei ĺá no meu MySQL, 'root' é o usuário e 'pass' é a senha que eu tinha escolhido
    host: 'localhost',
    dialect: 'mysql' // Tipo de banco de dados que eu quero me conectar  
}) 

module.exports = connection 
