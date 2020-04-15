[![Netlify Status](https://api.netlify.com/api/v1/badges/a26fd5c9-6123-475c-ba6c-1d6493c5eb66/deploy-status)](https://app.netlify.com/sites/fastpoker/deploys)
[![CircleCI](https://circleci.com/gh/acro5piano/fastpoker.svg?style=svg)](https://circleci.com/gh/acro5piano/fastpoker)

# fastpoker

An instant poker app: just share url to play with your friends

# Stack

**Overall**

- TypeScript
- Yarn workspaces
- CircleCI

**Frontend**

- React
- styled-components

**Server**

- Node.js
- Redux
- websockets/ws

# Deploy & Production

Currently using:

- Netflify for SPA hosting
- Heroku container registry

# TODO

- [x] The logic of winner
- [x] The logic of fold
- [x] Support for 2 players initial position
- [x] Decrease card logic (pop)
- [x] Showdown
- [x] Build stylish UI
- [x] Fix pre-flop limping bug
- [ ] Maximum bet
- [ ] Player Died
- [ ] Add various case tests
