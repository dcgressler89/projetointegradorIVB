// Módulos do node e inicialização de váriaveis
const express = require('express');
const server = express();
const router = express.Router();
const fs = require('fs');
server.use(express.json({extended: true}));

// Váriaveis para inicialização do servidor
const host = 'localhost';
const port = 3000;

// Leitura do arquivo
const readFile = () => {
    const content = fs.readFileSync('./data/contatos.json', 'utf-8');
    return(JSON.parse(content));
}

// Escrita do arquivo
const writeFile = (content) => {
    const updateFile =  JSON.stringify(content);
    fs.writeFileSync('./data/contatos.json', updateFile, 'utf-8');
}

// Rotas de acesso

// Rota de busca
router.get('/', function(req, res){
    const content = readFile();
    console.log(content);
    res.send(content);
});

// Rota de inserção
router.post('/', function(req, res){
    const currentContent = readFile();
    const {cliente_id, nome, endereco, cep, data_nascimento, telefone} = req.body;
    currentContent.push({cliente_id, nome, endereco, cep, data_nascimento, telefone});
    writeFile(currentContent);
    res.send(currentContent);
});


// Inicializa o servidor
server.use(router);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

