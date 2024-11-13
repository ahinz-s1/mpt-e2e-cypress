```
npm ci
npm start
```

N.B.: It requires users, accounts, api tokens and product to be created in platform as prerequisites
those should be added to the root in `config.json` file with following structure:

```json

{
  "URL": "<PORTAL URL>",
  "LOGIN": "<LOGIN PAGE URL>",

  "USER": {
    "login": "<USER EMAIL>",
    "password": "<USER PASSWORD>"
  },

  "ACCOUNTS": {
    "VENDOR": {
      "id": "<VENDOR ACCOUNT ID>",
      "token": "<VENDOR ACCOUNT TOKEN>"
    },
    "CLIENT": {
      "id": "<CLIENT ACCOUNT ID>",
      "token": "<CLIENT ACCOUNT TOKEN>"
    },
    "OPERATIONS": {
      "id": "<OPERATIONS ACCOUNT ID>",
      "token": "<OPERATIONS ACCOUNT TOKEN>"
    }
  },

  "PRODUCT": {
    "id": "<PRODUCT ID>"
  }
}
```