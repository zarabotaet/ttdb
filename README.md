# Table Tennis Blade Database (TTDB)

A React-based web application for viewing and exploring table tennis blade specifications.

## Features

- 📊 **Comprehensive Blade Database**: View detailed specifications of table tennis blades
- 🎨 **Visual Layer Representation**: Color-coded blade layers based on material types
- 📱 **Responsive Design**: Optimized for both desktop and mobile viewing
- ⚡ **Fast Performance**: Built with Vite and React for optimal loading speeds

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Effector
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Data Parsing**: PapaParse for CSV handling

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Getting Started

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd ttdb
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages (manual)

## Deployment

### Automatic Deployment (GitHub Actions)

This project is configured for automatic deployment to GitHub Pages:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy your site
3. Your site will be available at `https://[your-username].github.io/ttdb/`

### Manual Deployment

You can also deploy manually using the provided script:

```bash
# Make sure the script is executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

Or using npm commands:

```bash
npm run build
npm run deploy
```

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose `gh-pages` branch and `/ (root)` folder
5. Save the settings

Your site will be available at `https://[your-username].github.io/ttdb/`

## Project Structure

```
ttdb/
├── src/
│   ├── components/          # React components
│   │   ├── BladeTable.tsx   # Main table component
│   │   └── LoadingSpinner.tsx
│   ├── store.ts            # Effector state management
│   ├── types.ts            # TypeScript type definitions
│   └── App.tsx             # Main app component
├── public/                 # Static assets
├── parsing/               # Data parsing scripts
└── dist/                  # Built files (generated)
```

## Data Format

The application expects blade data in CSV format with the following columns:

- Brand
- Model
- Plies Number
- Weight
- Thickness
- Individual ply materials

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
