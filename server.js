//configurando o servidor
const express = require("express")
const server = express()

//configurando o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

// configurar conexão com banco de dados
const Pool = require('pg').Pool // Pool mantem conexão do banco de dados ativa
const db = new Pool({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5433,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", { // "./" - onde está o index, na raiz do projeto
    express: server,
    noCache: true
})


//configurar a apresentação da página
server.get("/", function(req, res) { 

    db.query("SELECT * FROM donors", function(err, result) {
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors }) 
    })
    
}) 

server.post("/", function(req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // validação dos dados
    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloca valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // fluxo de erro
        if(err) return res.send("erro no banco de dados.")
        console.log(err)

        // fluxo ideal
        return res.redirect("/")
    })

}) 

//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciei o servidor") 
}) 

