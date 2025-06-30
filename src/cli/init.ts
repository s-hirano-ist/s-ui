import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

interface InitOptions {
  yes?: boolean;
  cwd: string;
}

export async function init(options: InitOptions) {
  const cwd = path.resolve(options.cwd);
  
  console.log(chalk.cyan('Initializing s-ui in your project...'));
  
  // Check if package.json exists
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(chalk.red('Error: package.json not found. Please run this command in a project directory.'));
    process.exit(1);
  }

  // Check if already initialized
  const configPath = path.join(cwd, 'components.json');
  if (fs.existsSync(configPath) && !options.yes) {
    const response = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'components.json already exists. Overwrite?',
      initial: false,
    });

    if (!response.overwrite) {
      console.log(chalk.yellow('Initialization cancelled.'));
      process.exit(0);
    }
  }

  const spinner = ora('Creating configuration files...').start();

  try {
    // Create components.json
    const config = {
      "$schema": "https://ui.shadcn.com/schema.json",
      "style": "default",
      "rsc": true,
      "tsx": true,
      "tailwind": {
        "config": "tailwind.config.js",
        "css": "app/globals.css",
        "baseColor": "slate",
        "cssVariables": true,
        "prefix": ""
      },
      "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils"
      }
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    // Create components directory if it doesn't exist
    const componentsDir = path.join(cwd, 'components', 'ui');
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    // Create utils directory if it doesn't exist
    const utilsDir = path.join(cwd, 'lib');
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    // Create utils.ts if it doesn't exist
    const utilsPath = path.join(utilsDir, 'utils.ts');
    if (!fs.existsSync(utilsPath)) {
      const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;
      fs.writeFileSync(utilsPath, utilsContent);
    }

    spinner.succeed('Configuration created successfully!');
    
    console.log(chalk.green('\n✅ s-ui has been initialized!'));
    console.log(chalk.dim('\nNext steps:'));
    console.log(chalk.dim('  1. Add components with: npx s-ui add button'));
    console.log(chalk.dim('  2. List available components: npx s-ui list'));
    
  } catch (error) {
    spinner.fail('Failed to initialize s-ui');
    console.error(chalk.red(error));
    process.exit(1);
  }
}