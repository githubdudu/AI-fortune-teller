# CS732 project - Team 42

Welcome to the CS732 project. We look forward to seeing the amazing things you create this semester! This is your team's repository.

Your team members are:
- Ching-Yuan Chien _(cchi496@aucklanduni.ac.nz)_
- Katie Zhao _(szha992@aucklanduni.ac.nz)_
- Karson Sun _(ksun421@aucklanduni.ac.nz)_
- Jin Woo Kuk _(jkuk801@aucklanduni.ac.nz)_
- Dewey Dong _(hdon694@aucklanduni.ac.nz)_
- Yvonne Zhang _(byhz801@aucklanduni.ac.nz)_

You have complete control over how you run this repo. All your members will have admin access. The only thing setup by default is branch protections on `main`, requiring a PR with at least one code reviewer to modify `main` rather than direct pushes.

Please use good version control practices, such as feature branching, both to make it easier for markers to see your group's history and to lower the chances of you tripping over each other during development

![](./42.png)

## Project Setup

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Code Quality
1. Run ESLint to fix code issues (code will be changed):
```bash
npm run lint
```

2. Format code with Prettier (code will be changed):
```bash
npm run prettier
```

3. Test code format with Prettier (code will not be changed):
```bash
npm run prettier:check
```

4. Run both formatting and linting:
```bash
npm run format
```

The format command will run Prettier first to format your code, then ESLint to fix any remaining issues.

## Git Hooks and Commits

### Before each commits
This project uses Git hooks with Husky to ensure code quality before commits.

### How Git Hooks Work
The Husky configuration in this project automatically runs the following checks before each commit:
- Prettier formatting
- ESLint validation

This ensures all committed code follows the project's style and quality standards.

### Setup Git Hooks
The hooks are automatically installed when you run `npm install` in the frontend directory. 

### Skipping Hooks (Not Recommended)
In rare cases where you need to bypass the pre-commit hooks, you can use:

```bash
git commit -m "Your message" --no-verify
```

⚠️ Only use this in exceptional circumstances, as it bypasses quality checks.

## Project Structure

Our project follows a well-organized folder structure that promotes maintainability and separation of concerns:

```
group-project-42/
└── frontend/
    ├── .husky/                   # Git hooks directory
    ├── node_modules/             # Dependencies (installed packages)
    ├── public/                   # Static assets served directly
    ├── src/                      # Source code
    │   ├── assets/               # Images and other resources
    │   │   └── arcanaVerse.png   
    │   ├── components/           # Reusable UI components
    │   │   └── ArcanaVerseLogo/
    │   │       ├── ArcanaVerseLogo.jsx
    │   │       └── index.js
    │   ├── constants/            # Application-wide constants and configurations
    │   │   └── index.js         # Exports routes, API endpoints, theme values, etc.
    │   ├── context/              # React Context providers
    │   │   └── AppContextProvider/
    │   │       ├── AppContext.jsx
    │   │       ├── AppContextProvider.jsx
    │   │       └── index.js
    │   ├── hooks/               # Custom React hooks for reusable logic
    │   │   └── useToggle.js     # Example: toggle state management hook
    │   ├── pages/               # Page components
    │   │   └── HomePage/
    │   │       └── HomePage.jsx
    │   │       └── index.js
    │   ├── utils/               # Helper functions and utility methods
    │   │   └── index.js         # Common functions like formatters, validators, etc.
    │   ├── App.jsx              # Root component with routing
    │   ├── index.css            # Global styles with Tailwind
    │   └── main.jsx             # Application entry point
    ├── .gitignore                # Git ignore file
    ├── .prettierrc               # Prettier configuration
    ├── eslint.config.js          # ESLint configuration
    ├── index.html                # HTML entry point
    ├── package-lock.json         # Locked dependencies
    ├── package.json              # Frontend project npm setting
    └── vite.config.js            # Vite configuration
```

### Structure Guidelines

1. **Component Organization**:
   - Reused components put under `components` folder
   - One component per subfolder
   - Each component should be in its own directory with supporting files
   - Use `index.js` files for clean imports
   - Component-specific styles should use Tailwind utility classes
   ```javascript
      // index.js
      export { default } from './components/Component.jsx'

      // Usage. E.g. HomePage.jsx
      import Component from './components/Component'
      // instead of
      import Component from './components/Component.jsx'
   ```

2. **Context Management**:
   - Separate context definition from provider implementation
   - Use index.js files to export both pieces together

3. **Naming Conventions**:
   - Use PascalCase for component files and directories
   - Use camelCase for utility files
   - Use descriptive, purpose-oriented names

4. **Code Splitting**:
   - Keep files focused on a single responsibility
   - Avoid large monolithic components
   - Extract reusable logic into custom hooks








