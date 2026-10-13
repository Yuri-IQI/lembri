package com.borabill.lembriwearable.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.borabill.lembriwearable.LembriWearApplication
import com.borabill.lembriwearable.data.model.Lembrete
import com.borabill.lembriwearable.data.repository.LembreteRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/** Tudo que a tela precisa para se desenhar. */
data class LembretesUiState(
    val lembretes: List<Lembrete> = emptyList(),
    /** `null` = ainda verificando. */
    val celularConectado: Boolean? = null,
)

/**
 * Faz a ponte entre a UI e o [LembreteRepository].
 * A tela só lê [uiState] e chama funções: não conhece Data Layer nem JSON.
 */
class LembretesViewModel(
    private val repositorio: LembreteRepository,
) : ViewModel() {

    private val celularConectado = MutableStateFlow<Boolean?>(null)

    val uiState: StateFlow<LembretesUiState> =
        combine(repositorio.lembretes, celularConectado) { lembretes, conectado ->
            LembretesUiState(lembretes = lembretes, celularConectado = conectado)
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), LembretesUiState())

    init {
        verificarConexao()
    }

    fun verificarConexao() {
        viewModelScope.launch { celularConectado.value = repositorio.celularConectado() }
    }

    fun concluir(id: String) {
        viewModelScope.launch {
            val entregue = repositorio.concluir(id)
            celularConectado.value = entregue
        }
    }

    companion object {
        /** Factory que busca o repositório no AppContainer da Application. */
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app = this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY]
                    as LembriWearApplication
                LembretesViewModel(app.container.lembreteRepository)
            }
        }
    }
}
