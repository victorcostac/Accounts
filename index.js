//npm install -g npm@9.8.0 update que eu n sei pra que serve
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
            getAccountBalance()

        }else if(action === 'Depositar'){
            deposit()

        }else if(action === 'Sacar'){
            withdraw()

        }else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!!!'))
            process.exit()
        }
    })
    .catch((err) => console.log(err))
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
// add an amount to user account
function deposit(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        // verify if account exists
        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name:'amount',
                message:'Quanto você deseja depositar?'
            },
        ]).then((answer) => {

            const amount = answer['amount']
            if(!amount){
                console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente.'))
                return deposit()
            }
            // add an amount
            addAmount(accountName, amount)

            operation()
        }).catch(err => console.log(err))

    })
    .catch(err => console.log(err))
}


// helper functions
function checkAccount(accountName){
    
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Está conta não existe, escolha outra!'))
        return false
    }
    return true
}
function addAmount(accountName, amount){
    const accountData = getAccount(accountName)
    
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), function (err) {console.log(err)},)

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))

}
function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)

}

//show account balance
function getAccountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message:'qual o nome de sua conta'

        }
    ])
    .then((answer) => {

        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }
        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$${accountData.balance}`))
        operation()
    })
    .catch(err => console.log(err))
}

// withdraw an amount from user account
function withdraw(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta'
    }
    ])
    .then((answer) => {
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return withdraw()

        }
        inquirer.prompt([
            {
                name: 'amount',
                message:'Quanto você deseja sacar?'

        }
        ])
        .then((answer) => {
            const amount = answer['amount']
            removeAmount(accountName, amount)
            

        })
        .catch()
        
    })
    .catch(err => console.log(err))

}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente'),
        )
        return withdraw()
    }
    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('valor indisponível!'))
        return withdraw()

    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err){
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))
    operation()
}