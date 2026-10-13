package com.borabill.lembriwearable.data.comunicacao

/**
 * Contrato de comunicação entre o relógio e o celular (Wearable Data Layer API).
 *
 * ⚠️ Este arquivo tem um "espelho" no app mobile:
 *    MobileAPP/src/services/wear/contrato.ts
 * Qualquer mudança aqui (paths, capabilities ou formato do JSON) precisa ser
 * replicada lá, senão os dois lados deixam de se entender.
 */
object ContratoComunicacao {

    /**
     * Capabilities anunciadas por cada lado (declaradas em `res/values/wear.xml`).
     * Servem para descobrir QUAL nó (dispositivo) pareado roda o app parceiro.
     */
    const val CAPABILITY_MOBILE = "lembri_mobile"
    const val CAPABILITY_WEAR = "lembri_wear"

    /** Prefixo comum: usado também no intent-filter do WearableListenerService. */
    const val PATH_PREFIXO = "/lembri"

    /** Celular → relógio: envia um lembrete para ser exibido. Payload: [com.borabill.lembriwearable.data.model.Lembrete] em JSON. */
    const val PATH_LEMBRETE = "$PATH_PREFIXO/lembrete"

    /** Relógio → celular: avisa que o usuário concluiu um lembrete. Payload: [com.borabill.lembriwearable.data.model.Confirmacao] em JSON. */
    const val PATH_CONFIRMACAO = "$PATH_PREFIXO/confirmacao"
}
