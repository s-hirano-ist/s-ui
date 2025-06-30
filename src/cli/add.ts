import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fetch from 'node-fetch';

interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  cwd: string;
  path?: string;
}

interface ComponentInfo {
  name: string;
  files: string[];
  dependencies: string[];
  registryDependencies: string[];
}

const REGISTRY_BASE_URL = 'https://raw.githubusercontent.com/s-hirano-ist/s-ui/main/registry';

export async function add(components: string[], options: AddOptions) {
  const cwd = path.resolve(options.cwd);
  
  if (components.length === 0) {
    console.log(chalk.red('Error: Please specify component(s) to add.'));
    console.log(chalk.dim('Example: npx s-ui add button card'));
    process.exit(1);
  }

  // Check if project is initialized
  const configPath = path.join(cwd, 'components.json');
  if (!fs.existsSync(configPath)) {
    console.log(chalk.red('Error: components.json not found. Please run "npx s-ui init" first.'));
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const spinner = ora('Fetching component information...').start();

  try {
    const componentsToAdd: ComponentInfo[] = [];
    
    for (const componentName of components) {
      // Fetch component info from registry
      const infoUrl = `${REGISTRY_BASE_URL}/${componentName}/component.json`;
      const response = await fetch(infoUrl);
      
      if (!response.ok) {
        spinner.fail(`Component "${componentName}" not found in registry.`);
        console.log(chalk.dim('Run "npx s-ui list" to see available components.'));
        process.exit(1);
      }
      
      const componentInfo: ComponentInfo = await response.json() as ComponentInfo;
      componentsToAdd.push(componentInfo);
    }

    spinner.succeed('Component information fetched successfully!');

    // Show what will be installed
    console.log(chalk.cyan('\nThe following components will be added:'));
    componentsToAdd.forEach(comp => {
      console.log(chalk.green(`  ✓ ${comp.name}`));
      if (comp.dependencies.length > 0) {
        console.log(chalk.dim(`    Dependencies: ${comp.dependencies.join(', ')}`));
      }
    });

    if (!options.yes) {
      const response = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: 'Proceed with installation?',
        initial: true,
      });

      if (!response.proceed) {
        console.log(chalk.yellow('Installation cancelled.'));
        process.exit(0);
      }
    }

    const installSpinner = ora('Installing components...').start();

    // Install each component
    for (const comp of componentsToAdd) {
      const componentDir = path.join(cwd, config.aliases.components.replace('@/', ''), 'ui');
      
      if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
      }

      // Download component files
      for (const file of comp.files) {
        const fileUrl = `${REGISTRY_BASE_URL}/${comp.name}/${file}`;
        const response = await fetch(fileUrl);
        
        if (response.ok) {
          const content = await response.text();
          const filePath = path.join(componentDir, file);
          
          // Check if file exists and ask for confirmation
          if (fs.existsSync(filePath) && !options.overwrite && !options.yes) {
            const overwrite = await prompts({
              type: 'confirm',
              name: 'overwrite',
              message: `${file} already exists. Overwrite?`,
              initial: false,
            });

            if (!overwrite.overwrite) {
              continue;
            }
          }
          
          fs.writeFileSync(filePath, content);
        }
      }
    }

    installSpinner.succeed('Components installed successfully!');
    
    // Check for dependencies that need to be installed
    const allDependencies = new Set<string>();
    componentsToAdd.forEach(comp => {
      comp.dependencies.forEach(dep => allDependencies.add(dep));
    });

    if (allDependencies.size > 0) {
      console.log(chalk.yellow('\n⚠️  The following dependencies may need to be installed:'));
      Array.from(allDependencies).forEach(dep => {
        console.log(chalk.dim(`  npm install ${dep}`));
      });
    }

    console.log(chalk.green(`\n✅ Successfully added ${components.length} component(s)!`));
    
  } catch (error) {
    spinner.fail('Failed to add components');
    console.error(chalk.red(error));
    process.exit(1);
  }
}