# WA Project - Backend (Nodejs + Typescript)

## Description

That's a simple project using NodeJS, Typescript, MongoDB (with Typegoose) and express following REST

## Tecnologies

- NodeJS
- Typescript
- Typegoose
- Github Actions as CI
- Docker
- EKS
- Git hooks (Enforce eslint syntax and conventional commits)

<br>
## Development

Install dependencies

```bash
yarn install
```

Start app

```bash
yarn dev
```

<br>
## Production

First build the server

```bash
yarn build
```

Then run

```bash
yarn start
```

The default app port is 5000, in production mode i setted the port on k8s environment variables

<br><br>

## API Doc

- [Exam](./src/service/exam/README.md)
- [Laboratory](./src/service/laboratory/README.md)
