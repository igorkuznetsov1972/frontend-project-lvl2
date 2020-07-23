import commander from 'commander';
const program = commander.program;
const newCommand = new commander.Command();
program
.version('0.0.1')
.description('An application for generating diff file');
program.parse(process.argv);
console.log(program.args);
export default program;