# Dataview List Plugin for Obsidian

A plugin that scans your Obsidian vault, identifies Dataview queries (strings ending with `::`) and displays them in a side panel with clickable links to the files containing those queries.

## Features

### Version 1 (Current)
- 🔍 Scans vault for Dataview queries (strings ending with `::`)
- 📋 Displays queries in a convenient side panel
- 🔗 Click to navigate to files containing specific queries
- ⚙️ Exclude specific folders or files from scanning
- 🔄 Manual scan trigger via button or command

### Version 2 (Planned)
- 📊 Export query list to CSV or Markdown
- ⏱️ Auto-rescan vault on load or at defined intervals
- 🔤 Sortable list of queries
- 🔍 Filterable list of queries

## Installation

### Manual installation
1. Download the latest release
2. Extract the zip archive in `.obsidian/plugins/` directory
3. Reload Obsidian
4. Enable plugin in settings

## Usage

1. Click the Dataview List icon in the ribbon
2. The side panel will open showing all discovered queries
3. Click on a query to see all files containing that query
4. Click on a file to navigate to it

## Settings

### Version 1
- Exclude specific folders from scanning
- Exclude specific files from scanning
- Manual scan trigger via button or command

### Version 2 (Planned)
- Auto-rescan options
- Export settings
- Additional display options

## Development

This plugin is built using TypeScript and follows the structure of Obsidian's plugin system.

### Building

```bash
# Clone this repository
git clone https://github.com/YOUR_USERNAME/obsidian-dataview-list

# Install dependencies
npm install

# Build
npm run build
```

## License

[MIT License](LICENSE) 