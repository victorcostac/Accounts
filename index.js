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
            choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],

        },
    ])
    .then((answer) => {
        const action = answer['action']
        if (action === 'Criar Conta'){
            createAccount()
        }
        else if(action === 'Consultar Saldo'){

        }else if(action === 'Depositar'){

        }else if(action === 'Sacar'){

        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!!!'))
            process.exit()
        }
    })
    .catch((err) => conmsole.log(err))
}
// create account
function createAccount(){
    console.log(chalk.bgGreen.black('Parabéns por escolher o sistema Accounts!'))
    console.log(chalk.green('Defina suas opções de conta a seguir'))
    buildAccount()

}
function buildAccount(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta: '
    },
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'),
            )
            buildAccount()
            return 
        }
        
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err){
            console.log(err)
        },
        )

        console.log(chalk.green('PARABÉNS, A SUA CONTA FOI CRIADA!!'))
        operation()
    })
    .catch((err) => console.log(err))
}