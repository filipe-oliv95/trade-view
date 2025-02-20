const dbmgr = require("./dbManager")
const db = dbmgr.db

const getAllEstrategias = () => {
    try {
        const query = `SELECT * FROM estrategias`
        const readQuery = db.prepare(query)
        const rowList = readQuery.all()

        return { status: 200, data: rowList }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao buscar estrategias" }
    }
}

const getEstrategiaById = (id) => {
    try {
        const query = `SELECT * FROM estrategias WHERE id = ?`
        const readQuery = db.prepare(query)
        const row = readQuery.get(id)

        if (!row) {
            return { status: 404, message: "Estratégia não encontrada" }
        }

        return { status: 200, data: row }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao buscar estratégia" }
    }
}

const addEstrategia = (estrategia) => {
    try {
        const insertQuery = db.prepare(
            'INSERT INTO estrategias (nome, descricao, gain, loss, ativo_id) VALUES (?, ?, ?, ?, ?)'
        )

        const transaction = db.transaction(() => {
            const info = insertQuery.run(estrategia.nome, estrategia.descricao, estrategia.gain, estrategia.loss, estrategia.ativo_id)
            return info
        })

        const info = transaction()

        if (info.changes > 0) {
            return { status: 201, message: "Estratégia criada com sucesso", id: info.lastInsertRowid }
        } else {
            return { status: 400, message: "Falha ao criar estratégia" }
        }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao criar estratégia" }
    }
}

const updateEstrategia = (estrategia) => {
    try {
        const updateQuery = db.prepare(
            'UPDATE estrategias SET nome = ?, descricao = ?, gain = ?, loss = ?, ativo_id = ? WHERE id = ?'
        )

        const transaction = db.transaction(() => {
            const info = updateQuery.run(estrategia.nome, estrategia.descricao, estrategia.gain, estrategia.loss, estrategia.ativo_id, estrategia.id)
            return info
        })

        const info = transaction()

        if (info.changes > 0) {
            return { status: 200, message: "Estratégia atualizada com sucesso" }
        } else {
            return { status: 404, message: "Estratégia não encontrado ou sem alterações" }
        }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao atualizar estratégia" }
    }

}

const deleteEstrategia = (id) => {
    try {
        const query = 'DELETE FROM estrategias WHERE id = ?'
        const deleteQuery = db.prepare(query)
        const info = deleteQuery.run(id)

        if (info.changes > 0) {
            return { status: 200, message: "Estratégia deletada com sucesso" }
        } else {
            return { status: 404, message: "Estratégia não encontrada" }
        }
    } catch (err) {
        console.error(err)
        return { status: 500, message: "Erro ao excluir estratégia: há uma ou mais operações vinculadas a esta estratégia" }
    }
}


module.exports = {
    getAllEstrategias,
    getEstrategiaById,
    addEstrategia,
    updateEstrategia,
    deleteEstrategia
}