package com.borabill.lembriwearable.data.model

import org.json.JSONObject

/**
 * Lembrete recebido do celular.
 *
 * A serialização usa `org.json` (já embutido no Android) para não precisar de
 * bibliotecas extras. Os nomes das chaves seguem o tipo `Lembrete` em
 * MobileAPP/src/services/wear/contrato.ts.
 */
data class Lembrete(
    val id: String,
    val titulo: String,
    /** Horário já formatado pelo celular, ex.: "08:30". */
    val horario: String,
    /** Estado local do relógio: não trafega no JSON recebido. */
    val concluido: Boolean = false,
) {
    companion object {
        fun fromJson(json: String): Lembrete {
            val obj = JSONObject(json)
            return Lembrete(
                id = obj.getString("id"),
                titulo = obj.getString("titulo"),
                horario = obj.optString("horario", ""),
            )
        }
    }
}

/** Mensagem enviada de volta ao celular quando o usuário conclui um lembrete. */
data class Confirmacao(
    val lembreteId: String,
    /** Epoch em milissegundos. */
    val concluidoEm: Long = System.currentTimeMillis(),
) {
    fun toJson(): String = JSONObject()
        .put("lembreteId", lembreteId)
        .put("concluidoEm", concluidoEm)
        .toString()
}
