const { contextBridge } = require("electron/renderer");
const ativoDB = require("../../src/database/AtivoManager");
const estrategiaDB = require("../../src/database/EstrategiaManager");
const operacaoDB = require("../../src/database/OperacaoManager");

contextBridge.exposeInMainWorld("api", {
  sqlite: {
    ativoDB,
    estrategiaDB,
    operacaoDB,
  },
  versions: {
    node: () => process.versions.node,
    electron: () => process.versions.electron,
  },
});
