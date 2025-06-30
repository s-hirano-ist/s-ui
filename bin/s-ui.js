#!/usr/bin/env node

const { program } = require('commander');
const { init } = require('../dist/cli/init');
const { add } = require('../dist/cli/add');
const { list } = require('../dist/cli/list');

program
  .name('s-ui')
  .description('CLI for s-ui component library')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize s-ui in your project')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--cwd <path>', 'Current working directory', process.cwd())
  .action(init);

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Component names to add')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('--cwd <path>', 'Current working directory', process.cwd())
  .option('--path <path>', 'Path to add the component')
  .action(add);

program
  .command('list')
  .description('List all available components')
  .action(list);

program.parse();