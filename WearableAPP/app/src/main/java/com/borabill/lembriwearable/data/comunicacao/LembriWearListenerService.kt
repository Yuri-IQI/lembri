package com.borabill.lembriwearable.data.comunicacao

import android.util.Log
import com.borabill.lembriwearable.LembriWearApplication
import com.borabill.lembriwearable.data.model.Lembrete
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.WearableListenerService

/**
 * Porta de ENTRADA das mensagens vindas do celular.
 *
 * Declarado no AndroidManifest com um intent-filter para os paths "/lembri/...".
 * O Google Play Services inicia este serviço sob demanda, então os lembretes
 * chegam mesmo que o app do relógio esteja fechado.
 *
 * O serviço só traduz a mensagem (bytes → modelo) e repassa ao repositório;
 * nenhuma regra de negócio mora aqui.
 */
class LembriWearListenerService : WearableListenerService() {

    private val repositorio by lazy {
        (application as LembriWearApplication).container.lembreteRepository
    }

    override fun onMessageReceived(event: MessageEvent) {
        val payload = String(event.data)
        Log.d(TAG, "Mensagem recebida: ${event.path} -> $payload")

        when (event.path) {
            ContratoComunicacao.PATH_LEMBRETE -> {
                runCatching { Lembrete.fromJson(payload) }
                    .onSuccess(repositorio::receber)
                    .onFailure { Log.e(TAG, "Payload de lembrete inválido", it) }
            }
            // Novos paths do contrato entram aqui.
            else -> Log.w(TAG, "Path desconhecido: ${event.path}")
        }
    }

    private companion object {
        const val TAG = "LembriWearListener"
    }
}
