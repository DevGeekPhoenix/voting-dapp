module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "5777",
      gas: 6500000,
    },
    dashboard: {},
  },
  compilers: {
    solc: {
      version: "0.8.19",
    },
  },
  db: {
    enabled: false,
    host: "127.0.0.1",
  },
};
