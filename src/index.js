import commander from 'commander';
const program = commander.program;
const newCommand = new commander.Command();
program
.version('0.0.1')
.description('Compares two configuration files and shows a difference.')
.arguments('<filepath1> <filepath2>')
.option('-f, --format', 'output format');
program.parse(process.argv);
console.log(program.args);
export default program;