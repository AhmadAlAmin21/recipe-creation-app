# React Recipe Creation App

A modern React application built with traditional web technologies - no Vite, just Webpack!

## 🚀 Tech Stack

- **React 18** - Latest stable React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Webpack 5** - Traditional module bundler with hot reloading
- **CSS** - Custom utility-first CSS framework
- **HTML5** - Semantic markup

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx
│   ├── Main.tsx
│   └── Footer.tsx
├── hooks/              # Custom React hooks (ready for expansion)
├── types/               # TypeScript type definitions (ready for expansion)
├── utils/               # Utility functions (ready for expansion)
├── assets/              # Static assets
├── App.tsx              # Main App component
├── App.css              # App-specific styles
├── index.tsx            # Application entry point
└── index.css            # Global styles with utility classes
```

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Available Scripts

```bash
# Start development server with hot reloading
npm run dev

# Start development server (alternative)
npm run start

# Build for production
npm run build
```

### Development Server

Run `npm run dev` to start the development server. The app will be available at `http://localhost:3000`.

## 🎨 Features

- ⚡ **Hot Module Replacement** - Webpack provides instant hot reloading
- 🔷 **Type Safety** - Full TypeScript support with strict type checking
- 🎨 **Custom CSS** - Utility-first CSS classes for rapid UI development
- 📱 **Responsive Design** - Mobile-first responsive layout
- 🏗️ **Traditional Build** - No Vite, just Webpack as requested
- ⚛️ **Modern React** - Latest React 18 with hooks and functional components

## 📦 Dependencies

### Core Dependencies

- `react` - React library
- `react-dom` - React DOM rendering

### Development Dependencies

- `@types/react` - React TypeScript definitions
- `@types/react-dom` - React DOM TypeScript definitions
- `typescript` - TypeScript compiler
- `webpack` - Module bundler
- `webpack-cli` - Webpack command line interface
- `webpack-dev-server` - Development server with hot reloading
- `html-webpack-plugin` - HTML template plugin
- `ts-loader` - TypeScript loader for Webpack
- `css-loader` - CSS loader for Webpack
- `style-loader` - Style injector for Webpack

## 🚀 Deployment

The app can be deployed to any static hosting service:

1. Run `npm run build` to create a production build
2. Deploy the `dist` folder to your hosting service

Popular hosting options:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 🔧 Webpack Configuration

The project uses a custom Webpack configuration (`webpack.config.js`) that includes:

- TypeScript support with `ts-loader`
- CSS processing with `css-loader` and `style-loader`
- HTML template generation with `html-webpack-plugin`
- Development server with hot reloading
- Production optimizations

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Why No Vite?

This project was specifically created without Vite as requested. Instead, it uses:

- **Webpack 5** - The traditional, battle-tested module bundler
- **Manual configuration** - Full control over the build process
- **Traditional tooling** - No opinionated frameworks, just the tools you need
- **Proven stability** - Webpack has been the industry standard for years
