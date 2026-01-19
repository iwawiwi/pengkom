# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

reveal.js is an open-source HTML presentation framework that enables creating beautiful presentations in a web browser. It's built with vanilla JavaScript (ES6+) and uses a modular controller-based architecture.

## Development Commands

### Build and Development
- `npm start` or `gulp serve` - Start development server with live reload on http://localhost:8000
- `npm run build` or `gulp build` - Build all assets (JS, CSS, and plugins) to dist/
- `gulp` - Run full build pipeline including tests

### Testing
- `npm test` or `gulp test` - Run ESLint and QUnit tests
- `gulp qunit` - Run only QUnit tests via Puppeteer
- `gulp eslint` - Run only ESLint linting

### Component-Specific Tasks
- `gulp js` - Build both UMD (dist/reveal.js) and ESM (dist/reveal.esm.js) bundles
- `gulp js-es5` - Build UMD bundle only
- `gulp js-es6` - Build ESM bundle only
- `gulp plugins` - Build all built-in plugins (Highlight, Markdown, Search, Notes, Zoom, Math)
- `gulp css` - Build core CSS and all themes
- `gulp css-core` - Build only core reveal.css
- `gulp css-themes` - Build only theme CSS from Sass sources
- `gulp package` - Create distributable zip file

### Development Server Options
The serve command accepts custom options:
- `gulp serve --port=8080` - Use custom port
- `gulp serve --host=0.0.0.0` - Bind to custom host
- `gulp serve --root=./custom` - Serve from custom root directory

## Architecture

### Core Structure
- **js/reveal.js** - Main presentation engine and orchestration logic
- **js/index.js** - Public API wrapper that maintains backwards compatibility with pre-4.0 API
- **js/config.js** - Default configuration object with all available options
- **js/controllers/** - Modular controllers managing specific aspects of presentations:
  - `autoanimate.js` - Auto-animation between slides
  - `backgrounds.js` - Slide backgrounds and parallax effects
  - `controls.js` - Navigation control UI
  - `fragments.js` - Step-by-step reveal of content
  - `keyboard.js` - Keyboard navigation
  - `location.js` - URL hash and history management
  - `overview.js` - Slide overview mode
  - `plugins.js` - Plugin loading and lifecycle
  - `scrollview.js` - Alternative scroll-based view mode
  - `printview.js` - PDF print layout
  - `slidecontent.js` - Slide content formatting and processing
  - `slidenumber.js` - Slide number display
  - And more...

### Controller Pattern
Each controller is instantiated with a reference to the main Reveal instance and manages a specific feature domain. Controllers expose methods called by the main reveal.js orchestrator and can access the Reveal API.

### Plugin System
Built-in plugins live in plugin/ directory. Each plugin exports both UMD and ESM formats. Core plugins:
- **highlight** - Syntax highlighting via highlight.js
- **markdown** - Markdown slide content via marked
- **notes** - Speaker notes view
- **search** - Slide search functionality
- **zoom** - Alt+click zoom functionality
- **math** - LaTeX math rendering

### Build System
Uses Gulp 5 with Rollup for bundling:
- Babel transpiles to support browsers per browserslist config
- Two build targets: UMD (broad compatibility) and ESM (modern browsers)
- Sass compilation for themes and core CSS
- Source maps generated for all JS bundles

### Presentation Structure
HTML presentations require:
1. A `.reveal` container wrapping `.slides`
2. Each `<section>` is a slide
3. Nested `<section>` elements create vertical slides
4. Initialize via `Reveal.initialize({ /* config */ })`

## Code Conventions

### JavaScript
- Use ES6+ module syntax
- Follow ESLint config in package.json (includes rules for eqeqeq, wrap-iife, no-caller, etc.)
- Use const/let, never var
- Avoid accessing properties via bracket notation when dot notation works

### Configuration
- All config options defined in js/config.js with defaults
- Config precedence: defaults < Reveal.configure() < constructor options < initialize() options < URL query params
- Boolean flags should default to sensible values for typical use

### CSS/Themes
- Core styles in css/reveal.scss
- Themes in css/theme/source/ as Sass files
- Built themes output to dist/theme/

### Testing
- Test files in test/ directory as HTML pages
- Use QUnit for assertions
- Tests run in headless Chromium via Puppeteer
- Keep test server on port 8009 to avoid conflicts with dev server

## Key Implementation Details

### Multi-Instance Support
The 4.0+ API supports multiple Reveal instances on one page via `new Reveal(element, config)`. The legacy global API (`Reveal.initialize()`) creates a singleton and maintains backwards compatibility.

### View Modes
Three primary view modes:
- **Default** - Standard slide-by-slide navigation
- **Scroll** - Continuous scrolling through all slides
- **Print** - Optimized layout for PDF export

### Auto-Animation
Add `data-auto-animate` to consecutive slides. Elements with matching `data-id` attributes will animate smoothly between slides.

### Vertical Slides
Nest `<section>` elements to create vertical stacks. Navigation: horizontal arrows for main progression, vertical arrows for drilling down.

## Node.js Requirements
Requires Node.js >= 18.0.0
