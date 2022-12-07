//***************************** Variáveis Globais *****************************//

const Automerge = require('automerge') // Carrega o automerge no node
var fs = require("fs"); // file system
let verbose = false; // Ativa (true) e desativa (false) o modo verboso
let diff; // Variável para armazenar a diferença
let ant; // Variável para armazenar o conteúdo do arquivo anterior

//***************************** Funções *****************************//

//Função para exibir o manual:
function help() {

console.log("AMPATCH v0.1.0")
console.log("")
console.log("AMPATCH is a command line utility to recompose an Automerge-JSON file from the differences between two files")
console.log("")
console.log("Usage:")
console.log("    node ampatch.js <old_file> <diff_file> <new_file> [verbose]")
console.log("    node ampatch.js help")
console.log("")
console.log("Help:")
console.log("    Displays this manual")
console.log("")
console.log("Old_file:")
console.log("    Name of previous file")
console.log("")
console.log("Diff_file:")
console.log("    Name of the file containing the differences")
console.log("")
console.log("New_file:")
console.log("    Name of the new file to be generated")
console.log("")
console.log("Verbose:")
console.log("    Enable verbose mode")
console.log("")
console.log("More Information:")
console.log("")
console.log("    https://github.com/fabiobosisio/ampatch")
console.log("")
console.log("    Please report bugs at <https://github.com/fabiobosisio/ampatch/blob/master/README.md>")
console.log("")
}

// Função de remoção das extensões dos arquivos
function removext(file){
  file = file.substr(0, file.lastIndexOf('.')) || file;
  return file;
}

// Função de exibição do JSON formatado
function show(out){
  console.dir(out, { depth: null} );
  return null;
}

//***************************** Módulo Principal *****************************//

if(process.argv[5] == 'verbose'){ verbose = true;} // Habilita o modo verboso

if (process.argv[2] == 'help' || process.argv[2] == 'Help' || process.argv[2] == 'h' || process.argv[2] == null  || process.argv[3] == null){ // Exibe o manual
  help();
  return null
}

fileant = removext(process.argv[2])+".am" // Adiciona a extensão ao arquivo origem
if(!fs.existsSync(fileant)) { // Verifica se o arquivo existe localmente
  console.log("Arquivo "+fileant+" inexistente");
  return null
}
else{  
  ant = Automerge.load(fs.readFileSync(fileant, {encoding: null}));// Carrega o arquivo automerge
  if(verbose) {console.log('\x1b[36m%s\x1b[0m',"Arquivo anterior:"); show(ant);}
}
  
filediff = removext(process.argv[3])+".diff"// Adiciona a extensão ao arquivo de diferença
if(!fs.existsSync(filediff)) { // Verifica se o arquivo existe localmente
  console.log('\x1b[1m\x1b[31m%s',"\nArquivo "+filediff+" inexistente!",'\x1b[0m\n');
  
  return null
}
else{
  diff = JSON.parse(fs.readFileSync(filediff, {encoding: null})); // Carrega o arquivo de diferenças
  if(verbose) console.log('\x1b[36m%s\x1b[0m',"Diferenca obtida com sucesso");
}
 
let temp = []; // Variável de suporte
for (var y = 0; y < diff.length; y++) { // Obtem o array binário
  temp.push(Uint8Array.from(Object.values(diff[y])));
}

let [content, patch] = Automerge.applyChanges(ant, temp);// Aplica as diferenças e constroi o arquivo 

if(!process.argv[4]) { // Verifica se o argumento foi passado
  console.log('\x1b[1m\x1b[31m%s','\nNome de arquivo resultado nao informado, veja o manual!','\x1b[0m\n');
  return null
}
else{
  result = removext(process.argv[4])+".am"// Adiciona a extensão ao arquivo resultado  
  fs.writeFileSync(result, Automerge.save(content), {encoding: null}); // Salva o arquivo local .automerge com os metadados automerge do json
  if(verbose) {console.log('\x1b[36m%s\x1b[0m',"Arquivo resultado construido e salvo:"); show(content);}
}
