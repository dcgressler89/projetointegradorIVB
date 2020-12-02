// Modulo para inicialização do server
const express = require('express');
const server = express();

// Modulo para usar html
server.set('view engine', 'ejs');
const router = express.Router();

// Modulo para leitura e escrita de arquivos
const fs = require('fs');
server.use(express.json({extended: true}));

// Modulo para aceitar métodos put e delete no form html
const methodOverride = require('method-override');
server.use(methodOverride('_method'));

// Pega os dados do form html
server.use(express.urlencoded({extended: true}));

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

// Rotas da API
// Busca todos os dados
router.get('/', function(req, res){
    const content = readFile();
    // Renderiza a página index com a lista de contatos
    res.render('./index',{ lista : content });
});

// Carrega o formulário de adicionar
router.post('/', function(req, res){
    res.render('./form_add');
});

// Insere o contato ao arquivo
router.post('/adicionar', function(req, res){
    const currentContent = readFile();
    const {nome, endereco, cep, data_nascimento, telefone} = req.body;
    // Gera o id aleatório para a pessoa
    const cliente_id = Math.random().toString(32).substr(2.9);
    // Adiciona no array para ser adicionado no arquivo json
    currentContent.push({cliente_id, nome, endereco, cep, data_nascimento, telefone});
    writeFile(currentContent);
    const content = readFile();
    // Começo de testes com o modulo ejs
    res.render('./index',{ lista : content });
});

// Rota de busca de id especifico
router.get('/:cliente_id', function(req, res){
    const {cliente_id} = req.params;
    //res.send(cliente_id);
    const currentContent = readFile();
    // Busca elemento com a id especifica
    const selectedItem = currentContent.find((item) => item.cliente_id === cliente_id);
    res.render('./edit',{ contato : selectedItem});
});

// Edita o contato selecionado
router.put('/:cliente_id', function(req, res){
    const {cliente_id} = req.params;
    const {nome, endereco, cep, data_nascimento, telefone} = req.body;
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.cliente_id === cliente_id);
    const {cliente_id: cId, nome: cNome, endereco: cEndereco, cep: cCep, data_nascimento: cData, telefone: cTelefone} = currentContent[selectedItem];

    // Cria objeto para ser atualizado no arquivo
    const newContato = {
        cliente_id: cId,
        nome: nome ? nome : cNome,
        endereco: endereco ? endereco : cEndereco,
        cep: cep ? cep : cCep,
        data_nascimento: data_nascimento ? data_nascimento : cData,
        telefone: telefone ? telefone : cTelefone
    }

    currentContent[selectedItem] = newContato;
    writeFile(currentContent);
    const content = readFile();
    // Começo de testes com o modulo ejs
    res.render('./index',{ lista : content });
});

// Exclui o contato selecionado
router.delete('/:cliente_id', function(req, res){
    const {cliente_id} = req.params;
    const currentContent = readFile();
    // Busca elemento com a id especifica
    const selectedItem = currentContent.findIndex((item) => item.cliente_id === cliente_id);
    // Remove do array o item com a id
    currentContent.splice(selectedItem, 1);
    writeFile(currentContent);
    // Le novamente o arquivo
    const content = readFile();
    res.render('./index',{ lista : content });
});

// Inicializa o servidor
server.use(router);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

