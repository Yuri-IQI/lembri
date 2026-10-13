package com.borabill.lembriwearable.di

import android.content.Context
import com.borabill.lembriwearable.data.comunicacao.CelularDataSource
import com.borabill.lembriwearable.data.repository.LembreteRepository

/**
 * Injeção de dependências manual (sem Hilt/Koin, para manter o exemplo simples).
 *
 * Criado uma única vez em [com.borabill.lembriwearable.LembriWearApplication], então
 * Activity, ViewModel e ListenerService compartilham a MESMA instância do
 * repositório. É isso que faz uma mensagem recebida no serviço aparecer na tela.
 */
class AppContainer(context: Context) {
    private val celularDataSource = CelularDataSource(context)
    val lembreteRepository = LembreteRepository(celularDataSource)
}
