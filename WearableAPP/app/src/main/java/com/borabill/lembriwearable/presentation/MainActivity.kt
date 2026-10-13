package com.borabill.lembriwearable.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.getValue
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.wear.compose.material3.AppScaffold
import com.borabill.lembriwearable.presentation.theme.LembriWearableTheme

/**
 * Única Activity do relógio. Só monta o tema e liga o ViewModel à tela.
 *
 * Fluxo do exemplo:
 *  1. O celular envia um lembrete  → LembriWearListenerService → LembreteRepository
 *  2. O repositório emite a nova lista → ViewModel → LembretesScreen (recompõe)
 *  3. Usuário toca no lembrete      → ViewModel.concluir → CelularDataSource → celular
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        setContent {
            LembriWearableTheme {
                AppScaffold {
                    val viewModel: LembretesViewModel = viewModel(factory = LembretesViewModel.Factory)
                    val state by viewModel.uiState.collectAsStateWithLifecycle()

                    LembretesScreen(
                        state = state,
                        onConcluir = viewModel::concluir,
                        onAtualizar = viewModel::verificarConexao,
                    )
                }
            }
        }
    }
}
