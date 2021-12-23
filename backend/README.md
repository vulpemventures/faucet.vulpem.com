# backend

## 🖥 Local Development

Below is a list of commands you will probably find useful.

### `yarn dev`

Runs the project in development mode


## 🚀 Deploy to Heroku

Replace `faucet-liquid` with the Heroku App name

### Build image

```bash
docker buildx build --platform linux/amd64 --tag registry.heroku.com/faucet-liquid/web --push .
```

### Release

```bash
 heroku container:release web --app faucet-liquid                                               
```