import chalk from 'chalk';
import ora from 'ora';
import fetch from 'node-fetch';

interface Component {
  name: string;
  description: string;
  dependencies: string[];
}

const REGISTRY_BASE_URL = 'https://raw.githubusercontent.com/s-hirano-ist/s-ui/main/registry';

export async function list() {
  const spinner = ora('Fetching available components...').start();

  try {
    // Fetch components list from registry
    const response = await fetch(`${REGISTRY_BASE_URL}/components.json`);
    
    if (!response.ok) {
      spinner.fail('Failed to fetch components list from registry.');
      process.exit(1);
    }

    const components: Component[] = await response.json() as Component[];
    
    spinner.succeed('Available components:');
    
    console.log(chalk.cyan('\n📦 s-ui Components\n'));
    
    components.forEach(component => {
      console.log(chalk.green(`  ${component.name}`));
      console.log(chalk.dim(`    ${component.description}`));
      if (component.dependencies.length > 0) {
        console.log(chalk.dim(`    Dependencies: ${component.dependencies.join(', ')}`));
      }
      console.log('');
    });
    
    console.log(chalk.dim('Usage: npx s-ui add <component-name>'));
    console.log(chalk.dim('Example: npx s-ui add button card'));
    
  } catch (error) {
    spinner.fail('Failed to fetch components list');
    console.error(chalk.red(error));
    process.exit(1);
  }
}