// modulos externos 
const inquirer = require('inquirer')
const chalk = require('chalk')

// modulos internos 
const fs = require("fs")

console.log('Accounts iniciado')

operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'sacar', 'sair'],

        },

    ])
    .then((answer) => {
        const action = answer['action']
        console.log(action)
    })
    .catch((err) => conmsole.log(err))
}