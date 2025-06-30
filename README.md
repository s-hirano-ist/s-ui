# s-ui

A collection of reusable UI components built with React, TypeScript, and Tailwind CSS. Inspired by shadcn/ui, s-ui provides beautifully designed, accessible components that you can easily add to your projects.

## Installation

### Quick Start

Initialize s-ui in your project:

```bash
npx @s-hirano-ist/s-ui init
```

Add components to your project:

```bash
# Add a single component
npx @s-hirano-ist/s-ui add button

# Add multiple components
npx @s-hirano-ist/s-ui add button card input

# List available components
npx @s-hirano-ist/s-ui list
```

### Manual Installation

1. Configure npm to use GitHub Packages:

```bash
# Create or edit .npmrc in your project root
echo "@s-hirano-ist:registry=https://npm.pkg.github.com" >> .npmrc
```

2. Install the package:

```bash
npm install @s-hirano-ist/s-ui
```

3. Initialize the configuration:

```bash
npx @s-hirano-ist/s-ui init
```

## Requirements

- React 16.8+
- Tailwind CSS
- TypeScript (recommended)

## Usage

After running `s-ui init`, you'll have:

- `components.json` - Configuration file
- `components/ui/` - Directory for UI components
- `lib/utils.ts` - Utility functions

### Example

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

## Available Components

- **button** - Customizable button with multiple variants
- **card** - Flexible card component with header, content, footer
- **input** - Styled input field with focus states
- **label** - Form label component
- **badge** - Small status indicator badges
- **dialog** - Modal dialog with overlay
- **dropdown-menu** - Dropdown menu with keyboard navigation
- **select** - Styled select component
- **separator** - Visual divider component
- **skeleton** - Loading skeleton for better UX
- **tabs** - Tab component with keyboard navigation
- **textarea** - Styled textarea component
- **sonner** - Toast notification component
- **drawer** - Mobile-first drawer component

Run `npx @s-hirano-ist/s-ui list` to see all available components with descriptions.

## Configuration

The `components.json` file contains configuration for component installation:

```json
{
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
}
```

## CLI Commands

### `init`

Initialize s-ui in your project:

```bash
npx @s-hirano-ist/s-ui init
```

Options:

- `-y, --yes` - Skip confirmation prompts
- `--cwd <path>` - Set working directory

### `add`

Add components to your project:

```bash
npx @s-hirano-ist/s-ui add [component-names...]
```

Options:

- `-y, --yes` - Skip confirmation prompts
- `-o, --overwrite` - Overwrite existing files
- `--cwd <path>` - Set working directory
- `--path <path>` - Custom installation path

### `list`

List all available components:

```bash
npx @s-hirano-ist/s-ui list
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the CLI: `npm run build`
4. Test locally: `npm link`

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

Inspired by [shadcn/ui](https://ui.shadcn.com/) and built with:

- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [class-variance-authority](https://cva.style/) - Component variants
- [Storybook](https://storybook.js.org/) - Component development
