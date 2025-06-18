# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ensemble is a real-time mob programming application built as a monorepo with two main parts:
- **Server**: Node.js + TypeScript + Socket.IO WebSocket server (port 3000)
- **Web**: React 19 + Vite + TypeScript frontend client

## Essential Development Commands

### Server Development (cd server/)
```bash
npm run dev          # Start development server with hot reload
npm run start        # Start production server
npm run build        # Build TypeScript to JavaScript
npm run test         # Run server tests
npm run test:watch   # Run tests in watch mode
```

### Web Development (cd web/)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
npm run preview      # Preview production build
```

## Architecture Overview

### Real-time Communication
The application uses Socket.IO for real-time mob programming sessions with these key events:
- `session-state` - Broadcasts current mob session to all clients
- `create-user` - Creates new participants with roles
- `test-message`/`test-response` - Communication testing

### Mob Programming Domain
Core concepts include:
- **Participants**: Users with roles (navigator, driver, participant)
- **Sessions**: Real-time collaborative programming sessions with timer-based role rotation
- **Timer System**: Central functionality that drives the mob programming workflow
  - Once roles are assigned, sessions begin by starting a timer
  - When timer reaches 0, roles automatically rotate to next participants
  - Timer controls: start, pause, reset functionality
  - Timer state synchronized across all connected clients in real-time
- **State Broadcasting**: All session changes are immediately pushed to connected clients

### Project Structure
- `server/` - Node.js-based WebSocket server with TypeScript
- `web/` - React client with Vite build system
- Both applications use npm and have independent package.json files
- **Shared Types**: Types are defined in `server/src/types.ts` and imported by web client via `@server/types` alias
- Domain layer is referenced but not yet implemented

### Testing Setup
- **Server**: Vitest test runner
- **Web**: Vitest with jsdom environment and Testing Library
- Test utilities and setup configured in `web/test/`

### Code Quality
- ESLint with flat config format for both server and web
- Prettier configuration at repository root
- TypeScript strict mode enabled with path mapping

## Development Guidelines

### Test-Driven Development (TDD)
- **All functionality must be validated with tests first**
- Tests should have descriptive names that explain behavior clearly
  - Example: `it('should start the timer once we press the start button')`
  - Example: `it('should rotate roles when timer reaches zero')`
- Write the test first, make it pass, then refactor if needed

### Development Approach
- **Small iterations**: Never implement large features at once
- **Make it work first**: Don't optimize prematurely - focus on working solutions
- **Refactor when needed**: Only optimize after functionality is proven and tested

### Architecture Principles (Future Implementation)
The project will evolve to use **Domain Driven Design** and **SOLID principles**:
- **Main architecture**: Mix of vertical slicing with hexagonal architecture (ports and adapters)
- **Dependency Inversion**: Core principle throughout the codebase
- **Hexagonal Architecture**: Used within each vertical slice for maximum flexibility
- Each domain will have its own bounded context with domain and infrastructure layers

### Development Workflow
Both server and web applications can run independently. Start the server first for full functionality, then start the web client. The server includes a test client (`server/src/test-client.ts`) for testing Socket.IO communication.