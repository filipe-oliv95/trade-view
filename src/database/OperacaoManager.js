const dbmgr = require("./dbManager");
const db = dbmgr.db;

const getAllOperacoes = () => {
  try {
    const query = `SELECT * FROM operacoes ORDER BY data_hora ASC`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();

    return { status: 200, data: rowList };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Erro ao buscar operações" };
  }
};

const getOperacaoById = (id) => {
  try {
    const query = `SELECT * FROM operacoes WHERE id = ?`;
    const readQuery = db.prepare(query);
    const row = readQuery.get(id);

    if (!row) {
      return { status: 404, message: "Operação não encontrada" };
    }

    return { status: 200, data: row };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Erro ao buscar operação" };
  }
};

const addOperacao = (operacao) => {
  try {
    const insertQuery = db.prepare(
      "INSERT INTO operacoes (data_hora, ativo_id, estrategia_id, duracao, lado, n_contratos, men, mep, resultado_pnts, resultado_fin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const transaction = db.transaction(() => {
      const info = insertQuery.run(
        operacao.data_hora,
        operacao.ativo_id,
        operacao.estrategia_id,
        operacao.duracao,
        operacao.lado,
        operacao.n_contratos,
        operacao.men,
        operacao.mep,
        operacao.resultado_pnts,
        operacao.resultado_fin
      );
      return info;
    });

    const info = transaction();

    if (info.changes > 0) {
      return {
        status: 201,
        message: "Operação criada com sucesso",
        id: info.lastInsertRowid,
      };
    } else {
      return { status: 400, message: "Falha ao criar operação" };
    }
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Erro ao criar operação" };
  }
};

const updateOperacao = (operacao) => {
  try {
    const updateQuery = db.prepare(
      "UPDATE operacoes SET data_hora = ?, ativo_id = ?, estrategia_id = ?, duracao = ?, lado = ?, n_contratos = ?, men = ?, mep = ?, resultado_pnts = ?, resultado_fin = ? WHERE id = ?"
    );
    const transaction = db.transaction(() => {
      const info = updateQuery.run(
        operacao.data_hora,
        operacao.ativo_id,
        operacao.estrategia_id,
        operacao.duracao,
        operacao.lado,
        operacao.n_contratos,
        operacao.men,
        operacao.mep,
        operacao.resultado_pnts,
        operacao.resultado_fin,
        operacao.id
      );
      return info;
    });

    const info = transaction();

    if (info.changes > 0) {
      return { status: 200, message: "Operação atualizada com sucesso" };
    } else {
      return {
        status: 404,
        message: "Operação não encontrada ou sem alterações",
      };
    }
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Erro ao atualizar operação" };
  }
};

const deleteOperacao = (id) => {
  try {
    const query = "DELETE FROM operacoes WHERE id = ?";
    const deleteQuery = db.prepare(query);
    const info = deleteQuery.run(id);

    if (info.changes > 0) {
      return { status: 200, message: "Operação deletada com sucesso" };
    } else {
      return { status: 404, message: "Operação não encontrada" };
    }
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Erro ao excluir operação" };
  }
};

module.exports = {
  getAllOperacoes,
  getOperacaoById,
  addOperacao,
  updateOperacao,
  deleteOperacao,
};
