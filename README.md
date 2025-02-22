# AnimeSite

AnimeSite is a web application built with React and Vite that allows users to search for anime, view details, and stream episodes. The application uses the Jikan API to fetch anime data and a custom backend to stream episodes via WebTorrent. Checkout the episode fetching backend <a href="https://github.com/Sandblaze05/AnimeBackend.git">here</a> and stream backend <a href="https://github.com/Sandblaze05/anime-stream-backend.git">here</a>.

## Features

- Search for anime by title
- View detailed information about anime, including synopsis, rating, genres, and more
- Stream anime episodes directly from the application
- Responsive design with a modern UI

## Technologies Used

- React 19.0.0
- Vite 6.1.0
- TailwindCSS 4.0.6
- Axios 1.7.9
- Cheerio 1.0.0
- Lucide React 0.475.0
- React Router DOM 7.1.5
- React Use 17.6.0
- WebTorrent 2.5.19

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Sandblaze05/AnimeSite.git
   cd AnimeSite
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```

### Usage

To start the development server:
```sh
npm run dev
```

To build the project for production:
```sh
npm run build
```

To preview the production build:
```sh
npm run preview
```

To lint the code:
```sh
npm run lint
```

### Folder Structure
```
.
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── public/
│   └── favicon.png
├── README.md
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   │   └── miku-loading.gif
│   ├── components/
│   │   ├── card.jsx
│   │   ├── detailedCard.jsx
│   │   ├── loadMore.jsx
│   │   ├── search.jsx
│   │   └── torrentLinks.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── pages/
│   │   ├── AnimeDetails.jsx
│   │   ├── Home.jsx
│   │   ├── SearchResult.jsx
│   │   └── Stream.jsx
│   └── skeletons/
│       ├── skeletonCard.jsx
│       └── skeletonDetailedCard.jsx
└── vite.config.js
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
