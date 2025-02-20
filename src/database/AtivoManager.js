const dbmgr = require("./dbManager")
const db = dbmgr.db

const getAllAtivos = () => {
    try {
        const query = `SELECT * FROM ativos`
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()

        return { status: 200, data: rowList }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao buscar ativos" }
    }
}

const getAtivoById = (id) => {
    try {
        const query = `SELECT * FROM ativos WHERE id = ?`
        const readQuery = db.prepare(query)
        const row = readQuery.get(id)

        if (!row) {
            return { status: 404, message: "Ativo não encontrado" }
        }

        return { status: 200, data: row }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao buscar ativo" }
    }
}

const addAtivo = (ativo) => {
    try {
        const insertQuery = db.prepare(
            'INSERT INTO ativos (sigla, descricao, valor_contrato) VALUES (?, ?, ?)'
        )

        const transaction = db.transaction(() => {
            const info = insertQuery.run(ativo.sigla, ativo.descricao, ativo.valor_contrato)
            return info
        })

        const info = transaction()

        if (info.changes > 0) {
            return { status: 201, message: "Ativo criado com sucesso", id: info.lastInsertRowid }
        } else {
            return { status: 400, message: "Falha ao criar ativo" }
        }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao criar ativo" }
    }
}

const updateAtivo = (ativo) => {
    try {
        const updateQuery = db.prepare(
            'UPDATE ativos SET sigla = ?, descricao = ?, valor_contrato = ? WHERE id = ?'
        )

        const transaction = db.transaction(() => {
            const info = updateQuery.run(ativo.sigla, ativo.descricao, ativo.valor_contrato, ativo.id)
            return info
        })

        const info = transaction()

        if (info.changes > 0) {
            return { status: 200, message: "Ativo atualizado com sucesso" }
        } else {
            return { status: 404, message: "Ativo não encontrado ou sem alterações" }
        }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao atualizar ativo" }
    }
}

const deleteAtivo = (id) => {
    try {
        const query = 'DELETE FROM ativos WHERE id = ?'
        const deleteQuery = db.prepare(query)
        const info = deleteQuery.run(id)

        if (info.changes > 0) {
            return { status: 200, message: "Ativo deletado com sucesso" }
        } else {
            return { status: 404, message: "Ativo não encontrado" }
        }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao excluir ativo: há uma ou mais estratégias vinculadas a este ativo" }
    }
}

module.exports = {
    getAllAtivos,
    getAtivoById,
    addAtivo,
    updateAtivo,
    deleteAtivo
}
