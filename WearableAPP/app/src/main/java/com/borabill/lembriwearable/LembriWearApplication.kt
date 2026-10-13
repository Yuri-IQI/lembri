package com.borabill.lembriwearable

import android.app.Application
import com.borabill.lembriwearable.di.AppContainer

/**
 * Ponto de entrada do processo (registrado em `android:name` no AndroidManifest).
 * Mantém o [AppContainer] vivo enquanto o processo existir.
 */
class LembriWearApplication : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}
