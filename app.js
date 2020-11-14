// Módulos do node e inicialização de váriaveis
const express = require('express');
const server = express();
//server.set('view engine', 'ejs');
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
    //console.log(content);
    res.send(content);
    //res.render('./index',{ lista : content });
});

// Rota de inserção
router.post('/', function(req, res){
    const currentContent = readFile();
    const {nome, endereco, cep, data_nascimento, telefone} = req.body;
    const id_cliente = Math.random().toString(32).substr(2.9);
    currentContent.push({id_cliente, nome, endereco, cep, data_nascimento, telefone});
    writeFile(currentContent);
    res.send(currentContent);
});

// Rota de exclusão
router.delete('/:id_cliente', function(req, res){
    const {id_cliente} = req.params;
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.id_cliente === id_cliente);
    currentContent.splice(selectedItem, 1);
    writeFile(currentContent);
    res.send(true);
});

// Rota de update
router.put('/:id_cliente', function(req, res){
    const {id_cliente} = req.params;
    const {nome, endereco, cep, data_nascimento, telefone} = req.body;
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.id_cliente === id_cliente);
    const {id_cliente: cId, nome: cNome, endereco: cEndereco, cep: cCep, data_nascimento: cData, telefone: cTelefone} = currentContent[selectedItem];

    const newContato = {
        id_cliente: cId,
        nome: nome ? nome : cNome,
        endereco: endereco ? endereco : cEndereco,
        cep: cep ? cep : cCep,
        data_nascimento: data_nascimento ? data_nascimento : cData,
        telefone: telefone ? telefone : cTelefone
    }

    currentContent[selectedItem] = newContato;
    writeFile(currentContent);
    res.send(newContato);
});

// Inicializa o servidor
server.use(router);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

