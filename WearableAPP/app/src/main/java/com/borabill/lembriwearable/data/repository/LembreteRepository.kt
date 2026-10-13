package com.borabill.lembriwearable.data.repository

import com.borabill.lembriwearable.data.comunicacao.CelularDataSource
import com.borabill.lembriwearable.data.comunicacao.ContratoComunicacao
import com.borabill.lembriwearable.data.model.Confirmacao
import com.borabill.lembriwearable.data.model.Lembrete
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

/**
 * Fonte única da verdade dos lembretes no relógio.
 *
 * - Guarda o estado em um [StateFlow] em memória (a UI observa e se atualiza sozinha).
 * - Usa o [CelularDataSource] para falar com o celular.
 *
 * Para persistir entre reinicializações, troque o MutableStateFlow por um
 * DataStore/Room aqui dentro: ViewModel e telas não precisam mudar.
 */
class LembreteRepository(
    private val celular: CelularDataSource,
) {
    private val _lembretes = MutableStateFlow<List<Lembrete>>(emptyList())
    val lembretes: StateFlow<List<Lembrete>> = _lembretes.asStateFlow()

    /** Chamado pelo ListenerService quando o celular envia um lembrete. */
    fun receber(lembrete: Lembrete) {
        // Se já existir um lembrete com o mesmo id, ele é substituído (o celular reenviou/editou).
        _lembretes.update { atuais -> atuais.filterNot { it.id == lembrete.id } + lembrete }
    }

    /**
     * Marca o lembrete como concluído localmente e avisa o celular.
     * @return `true` se o celular recebeu a confirmação.
     */
    suspend fun concluir(id: String): Boolean {
        _lembretes.update { atuais ->
            atuais.map { if (it.id == id) it.copy(concluido = true) else it }
        }
        return celular.enviar(ContratoComunicacao.PATH_CONFIRMACAO, Confirmacao(id).toJson())
    }

    suspend fun celularConectado(): Boolean = celular.buscarCelulares().isNotEmpty()
}
