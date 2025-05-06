# Smart Bookmark Manager

A visual bookmark manager application that helps you organize, filter, and manage your bookmarks with a modern UI.

## Features

- Add, edit, and delete bookmarks
- Categorize bookmarks for better organization
- Tag bookmarks for easy filtering
- Search bookmarks by title, URL or notes
- Automatic favicon detection
- Dark mode support
- Import and export bookmarks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-visual-bookmark-manager.git
cd smart-visual-bookmark-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Or use the silent start mode to hide webpack deprecation warnings:
```bash
npm run start-silent
```

4. Open your browser to `http://localhost:3000`

## Handling Deprecation Warnings

This app uses React 18 and Webpack 5 via Create React App. There are some deprecation warnings related to webpack dev server configuration. These are harmless and will be fixed in future versions of webpack.

To suppress these warnings, use:
```bash
npm run start-silent
```

If you have issues with Node.js compatibility, try adding the following to your environment:
```bash
set NODE_OPTIONS=--openssl-legacy-provider
```

## Technology Stack

- React 18
- TypeScript
- Firebase (Authentication, Firestore)
- Tailwind CSS

## Updating Dependencies

To check for outdated dependencies and update them:
```bash
npm run update-deps
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.