# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Run Command
run_command: "echo 'Please run the appropriate command in a separate terminal window:\n- Main project: npm start (port 8000)\n- Tuning demo: cd demos/tuning-demo && npm run dev (port 3000)\nUse Ctrl+C to safely exit when done.'"

## Project Overview
This is a reveal.js-based presentation repository for AI inspiration talks. It contains:
- The core reveal.js presentation framework (v5.2.1)
- Custom presentation files for AI-related talks (ai-inspiration-5degrees.html, prompt-engineering-talk.html, temperature-demo.html)
- A Next.js demo application in `demos/tuning-demo/` showcasing AI parameter tuning
- Custom themes and styling for presentations

## Common Commands
### Main Project (Reveal.js Framework)
- `npm start` or `gulp serve` - Start development server with live reload on port 8000
- `npm run build` or `gulp build` - Build the reveal.js framework (JS, CSS, plugins)
- `npm test` or `gulp test` - Run ESLint and QUnit tests
- `npm build-azure` - Build for Azure Static Web Apps deployment (creates output/ directory)

### Tuning Demo (Next.js App)
Navigate to `demos/tuning-demo/` first:
- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build the Next.js application
- `npm run start` - Start production server
- `npm run lint` - Run Next.js ESLint

## Development Notes
- Run development servers in dedicated terminal windows for easy exit with Ctrl+C
- The framework builds both UMD (`dist/reveal.js`) and ES module (`dist/reveal.esm.js`) versions
- Plugins are built separately and can be loaded independently
- Live reload watches HTML, Markdown, and source files
- Tests run in headless Chrome via Puppeteer
- Custom Azure build task creates deployment-ready output with renamed index file

## Architecture
### Reveal.js Framework Structure
- `js/reveal.js` - Main reveal.js export and initialization
- `js/index.js` - Entry point for the framework
- `js/controllers/` - Feature controllers (slides, fragments, keyboard, etc.)
- `js/components/` - Reusable components (playback controls)
- `js/utils/` - Utility functions and constants
- `css/` - SCSS source files for themes and core styles
- `plugin/` - Built-in plugins (highlight, markdown, search, notes, zoom, math)

### Build System
- Uses Gulp as the primary build system
- Rollup for JavaScript bundling (creates both UMD and ES module builds)
- Sass compilation for CSS
- Babel for JavaScript transpilation
- Separate builds for framework core and plugins

### Presentation Files
- Main presentation files are in the root directory (*.html)
- Custom styling and configuration embedded in each presentation
- Assets (images, videos, diagrams) stored in `assets/` directory
- Built presentations output to `output/` for deployment

### Demo Application
- `demos/tuning-demo/` - Next.js 15 app with TypeScript
- Uses Tailwind CSS and Radix UI components
- Recharts for data visualization
- Demonstrates AI parameter tuning concepts