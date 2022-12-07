//***************************** Variáveis Globais *****************************//

const Automerge = require('automerge') // Carrega o automerge no node
var fs = require("fs"); // file system

//***************************** Funções *****************************//
// Função de leitura do arquivo Automerge-Json
function recompose(file, ext){
  let output;
  // Remove extensoes passadas no nome do arquivo nos argumentos
  file = file.substr(0, file.lastIndexOf('.')) || file;
  file = file+"."+ext
  // Verifica se o arquivo existe localmente
  if(!fs.existsSync(file)) {
    if(verbose) console.log("Arquivo inexistente");
  }
  else {
    // Carrega o arquivo
    output = Automerge.load(fs.readFileSync(file, {encoding: null}));
    return output;

  }
}
 
let ant = recompose(process.argv[2],'am')
//let tp = recompose(process.argv[3], 'diff')
let teste = fs.readFileSync(process.argv[3], {encoding: null})
let diff = JSON.parse(teste)
//let diff = Automerge.load(teste2);
 			
let temp = [];
for (var y = 0; y < diff.length; y++) {
  temp.push(Uint8Array.from(Object.values(diff[y])));
}
let [Doc3, patch] = Automerge.applyChanges(ant, temp);
content = Doc3;
console.log(content);

		

// Salva o arquivo local .automerge com os metadados automerge do json
fs.writeFileSync(process.argv[4]+".am", Automerge.save(content), {encoding: null}); 
fs.writeFileSync(process.argv[4]+".json", JSON.stringify(Automerge.load(process.argv[4]+".am")), {encoding: null}); 
						
//console.log('\x1b[36m%s\x1b[0m',`\nDiferenca entre o arquivo local e o conteudo da cadeia:`);
//console.log(Automerge.load(filediff));

