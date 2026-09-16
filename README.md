# ProSport Store

A small sportswear storefront built with Node.js and Express. The application serves a browser-based product catalogue, provides product and health-check APIs, and can be packaged and published as a Docker image through Jenkins.

## Features

- Browse a catalogue of sportswear products.
- Filter products by category: **Footwear**, **Apparel**, and **Outerwear**.
- Add products to a client-side cart counter.
- Retrieve all products or filter them through the REST API.
- Check application availability with a health endpoint.
- Run automated smoke tests.
- Build and publish a Docker image with Jenkins.

## Technology stack

- **Runtime:** Node.js 20
- **Backend:** Express 4
- **Frontend:** HTML, CSS, and vanilla JavaScript
- **Testing:** Node.js HTTP smoke test
- **Containerization:** Docker
- **CI/CD:** Jenkins

## Project structure

```text
.
├── public/
│   ├── index.html       # Store page markup
│   ├── app.js           # Product loading, category filters, and cart counter
│   └── style.css        # Store layout and styling
├── Report/
│   ├── Jenkins_CI_CD_Pipeline_Report.docx
│   └── Jenkins_CI_CD_Pipeline_Report.pdf
├── .dockerignore        # Files excluded from the Docker build context
├── Dockerfile           # Node.js container definition
├── Jenkinsfile          # Jenkins build, test, Docker build, and push pipeline
├── package.json         # Project metadata, scripts, and dependencies
├── package-lock.json    # Locked dependency versions
├── server.js            # Express server, product data, and API routes
└── test.js              # Health and products endpoint smoke tests
```

> `node_modules/` may be present in the repository, but dependencies should normally be installed with `npm install` and excluded from version control.

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Install dependencies

```bash
npm install
```

### Start the application

```bash
npm start
```

The server listens on port `3000` by default. Open [http://localhost:3000](http://localhost:3000) in a browser.

To use a different port:

```bash
PORT=4000 npm start
```

On Windows Command Prompt:

```bat
set PORT=4000 && npm start
```

## API reference

### List products

```http
GET /api/products
```

Optional category filtering is supported:

```http
GET /api/products?category=Footwear
```

The category comparison is case-insensitive. The response is a JSON array of products containing `id`, `name`, `category`, `price`, `stock`, and `image` fields.

### Get a product

```http
GET /api/products/:id
```

Example:

```bash
curl http://localhost:3000/api/products/1
```

Returns `404` with `{ "error": "Product not found" }` when the product ID does not exist.

### Health check

```http
GET /health
```

Returns the application status and version:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

The version can be overridden with the `APP_VERSION` environment variable.

## Testing

Run the smoke tests with:

```bash
npm test
```

The test script starts the server on port `3999`, verifies `/health`, requests `/api/products`, and exits with a success or failure status.

## Docker

Build the image:

```bash
docker build -t sportswear-store .
```

Run the container:

```bash
docker run --rm -p 3000:3000 sportswear-store
```

Then visit [http://localhost:3000](http://localhost:3000).

The Docker image is based on `node:20-alpine`, installs production dependencies, exposes port `3000`, and starts `server.js`.

## Jenkins pipeline

`Jenkinsfile` defines the following stages:

1. **Checkout** – retrieves the source code.
2. **Build** – installs npm dependencies.
3. **Test** – runs `npm test`.
4. **Docker Build** – creates both a build-number tag and a `latest` tag.
5. **Docker Push** – authenticates with Docker Hub and pushes both tags.

The pipeline expects:

- A Jenkins agent capable of running the configured Windows `bat` commands.
- Docker available through the configured `DOCKER_HOST`.
- A Jenkins credential with the ID `dockerhub-creds`.
- Permission to push to the configured Docker Hub image repository.

Do not commit real credentials or passwords. The repository contains a `Jenkin Credentials.txt` file; treat credential documentation or examples as sensitive and replace any exposed credentials immediately.

## Notes

- Product data is currently stored in memory in `server.js`; it is not backed by a database.
- The cart is a front-end counter only and does not create orders or persist cart contents.
- Product images are represented by emoji values in the product data.
