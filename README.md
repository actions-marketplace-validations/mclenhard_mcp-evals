# MCP Evals

A Node.js package and GitHub Action for evaluating MCP (Model Context Protocol) tool implementations using LLM-based scoring. This helps ensure your MCP server's tools are working correctly and performing well.

## Installation

### As a Node.js Package

```bash
npm install @matthewlenhard/mcp-evals
```

### As a GitHub Action

Add the following to your workflow file:

```yaml
name: Run MCP Evaluations

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run MCP Evaluations
        uses: matthewlenhard/mcp-evals@v1
        with:
          evals_path: 'path/to/your/evals.ts'
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
          model: 'gpt-4'  # Optional, defaults to gpt-4
```

## Usage

### 1. Create Your Evaluation File

Create a file (e.g., `evals.ts`) that exports your evaluation configuration:

```typescript
import { EvalConfig } from '@matthewlenhard/mcp-evals';
import { openai } from "@ai-sdk/openai";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define your evaluation function
const myToolEval = {
  name: 'My Tool Evaluation',
  description: 'Evaluates the accuracy and completeness of my tool',
  run: async (model) => {
    const result = await grade(model, "What is the result of using my tool?");
    return JSON.parse(result);
  }
};

// Export the configuration
const config: EvalConfig = {
  model: openai("gpt-4"),
  evals: [myToolEval]
};

export default config;
```

### 2. Run the Evaluations

#### As a Node.js Package

You can run the evaluations using the CLI:

```bash
npx mcp-eval path/to/your/evals.ts
```

Or programmatically:

```typescript
import { runAllEvals } from '@matthewlenhard/mcp-evals';
import config from './path/to/your/evals';

const results = await runAllEvals(config);

// Process the results
for (const [name, result] of results.entries()) {
  console.log(`\n${name}:`);
  console.log(JSON.stringify(result, null, 2));
}
```

#### As a GitHub Action

The action will automatically:
1. Run your evaluations
2. Post the results as a comment on the PR
3. Update the comment if the PR is updated

## Evaluation Results

Each evaluation returns an object with the following structure:

```typescript
interface EvalResult {
  accuracy: number;        // Score from 1-5
  completeness: number;    // Score from 1-5
  relevance: number;       // Score from 1-5
  clarity: number;         // Score from 1-5
  reasoning: number;       // Score from 1-5
  overall_comments: string; // Summary of strengths and weaknesses
}
```

## Example Server

The package includes an example server that demonstrates how to implement and evaluate MCP tools. The example server includes:

1. A simple addition tool
2. A dynamic greeting resource
3. A weather tool evaluation

To run the example server:

```bash
# Clone the repository
git clone https://github.com/matthewlenhard/mcp-evals.git
cd mcp-evals

# Install dependencies
npm install

# Run the example evaluations
npm run eval example-server/evals/evals.ts
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

### Evaluation Configuration

The `EvalConfig` interface requires:

- `model`: The language model to use for evaluation (e.g., GPT-4)
- `evals`: Array of evaluation functions to run

Each evaluation function must implement:

- `name`: Name of the evaluation
- `description`: Description of what the evaluation tests
- `run`: Async function that takes a model and returns an `EvalResult`

## License

MIT 