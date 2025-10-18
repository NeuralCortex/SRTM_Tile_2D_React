# SRTM Tile 2D Viewer React 1.0.0

![App Screenshot](https://github.com/NeuralCortex/SRTM_Tile_2D_React/blob/main/app.jpg)

The SRTM Tile 2D Viewer is a web application built with React that enables users to visualize topographic data from NASA's [Shuttle Radar Topography Mission (SRTM)](https://en.wikipedia.org/wiki/STS-99) on OpenStreetMap. The app supports loading and displaying both SRTM-3 and SRTM-1 tiles.

## Features

- Load and display SRTM-3 and SRTM-1 topographic tiles.
- Visualize tiles on OpenStreetMap.
- Display high-resolution height values in the status bar when hovering over a tile.
- Copy coordinates from Google Maps by pasting (Ctrl+V) into Longitude or Latitude fields.
- Intuitive and user-friendly interface.

## Installation

To set up the project locally, follow these steps:

1. Install [Node.js](https://nodejs.org).
2. Clone the repository:
   ```bash
   git clone https://github.com/NeuralCortex/SRTM_Tile_2D_React.git
   ```
3. Navigate to the project directory:
   ```bash
   cd SRTM_Tile_2D_React
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm start
   ```
   Or, build for production:
   ```bash
   npm run build
   ```

## Usage

1. Launch the app using `npm start`.
2. Import an SRTM tile (e.g., `N49E011.hgt`).
3. View the tile on OpenStreetMap.
4. Hover over the tile to see height values in the status bar.
5. Paste coordinates (Ctrl+V) from Google Maps into the Longitude or Latitude fields for precise navigation.

## File Structure

SRTM files typically have names like `N49E011.hgt`.

### Internal Structure

The `.hgt` file contains 16-bit signed integer values, with no header or trailer.

#### 1x1 Degree SRTM-3 Tile
```
North X=0,Y=1201 ********************* X=1201,Y=1201
                 *********************
                 *********************
                 *********************
South X=0,Y=0    ********************* X=1201,Y=0
                 West             East
```

#### 1x1 Degree SRTM-1 Tile
```
North X=0,Y=3601 ********************* X=3601,Y=3601
                 *********************
                 *********************
                 *********************
South X=0,Y=0    ********************* X=3601,Y=0
                 West             East
```

## Technologies Used

- [Create React App](https://github.com/facebook/create-react-app)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/)
- [Google Chrome](https://www.google.com/chrome/)

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). For more details, refer to the [Create React App documentation](https://create-react-app.dev/docs/getting-started).