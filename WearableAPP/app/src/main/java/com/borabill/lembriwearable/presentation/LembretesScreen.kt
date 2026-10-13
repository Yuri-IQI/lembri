package com.borabill.lembriwearable.presentation

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.wear.compose.foundation.lazy.TransformingLazyColumn
import androidx.wear.compose.foundation.lazy.items
import androidx.wear.compose.foundation.lazy.rememberTransformingLazyColumnState
import androidx.wear.compose.material3.Button
import androidx.wear.compose.material3.ButtonDefaults
import androidx.wear.compose.material3.EdgeButton
import androidx.wear.compose.material3.ListHeader
import androidx.wear.compose.material3.MaterialTheme
import androidx.wear.compose.material3.ScreenScaffold
import androidx.wear.compose.material3.SurfaceTransformation
import androidx.wear.compose.material3.Text
import androidx.wear.compose.material3.lazy.rememberTransformationSpec
import androidx.wear.compose.material3.lazy.transformedHeight
import androidx.wear.compose.ui.tooling.preview.WearPreviewDevices
import com.borabill.lembriwearable.data.model.Lembrete
import com.borabill.lembriwearable.presentation.theme.LembriWearableTheme

/**
 * Tela "burra" (stateless): recebe o estado pronto e devolve eventos por lambdas.
 * Isso facilita preview e testes, já que não depende do ViewModel.
 */
@Composable
fun LembretesScreen(
    state: LembretesUiState,
    onConcluir: (String) -> Unit,
    onAtualizar: () -> Unit,
) {
    val listState = rememberTransformingLazyColumnState()
    val transformationSpec = rememberTransformationSpec()

    ScreenScaffold(
        scrollState = listState,
        edgeButton = {
            // Botão da borda inferior: verifica de novo a conexão com o celular.
            EdgeButton(
                onClick = onAtualizar,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.secondaryContainer,
                    contentColor = MaterialTheme.colorScheme.onSecondaryContainer,
                ),
            ) {
                Text("Atualizar")
            }
        },
    ) { contentPadding ->
        TransformingLazyColumn(contentPadding = contentPadding, state = listState) {
            item {
                ListHeader(
                    modifier = Modifier.fillMaxWidth().transformedHeight(this, transformationSpec),
                    transformation = SurfaceTransformation(transformationSpec),
                ) {
                    Text("Lembri")
                }
            }
            item {
                Text(
                    text = when (state.celularConectado) {
                        null -> "Procurando celular…"
                        true -> "Celular conectado"
                        false -> "Celular desconectado"
                    },
                    style = MaterialTheme.typography.bodySmall,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            if (state.lembretes.isEmpty()) {
                item {
                    Text(
                        text = "Nenhum lembrete.\nEnvie um pelo celular.",
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
            }

            items(state.lembretes, key = { it.id }) { lembrete ->
                Button(
                    onClick = { onConcluir(lembrete.id) },
                    enabled = !lembrete.concluido,
                    modifier = Modifier.fillMaxWidth().transformedHeight(this, transformationSpec),
                    transformation = SurfaceTransformation(transformationSpec),
                    label = { Text(lembrete.titulo) },
                    secondaryLabel = {
                        Text(if (lembrete.concluido) "Concluído ✓" else "${lembrete.horario} · toque p/ concluir")
                    },
                )
            }
        }
    }
}

@WearPreviewDevices
@Composable
private fun LembretesScreenPreview() {
    LembriWearableTheme {
        LembretesScreen(
            state = LembretesUiState(
                lembretes = listOf(
                    Lembrete(id = "1", titulo = "Tomar remédio", horario = "08:00"),
                    Lembrete(id = "2", titulo = "Beber água", horario = "10:00", concluido = true),
                ),
                celularConectado = true,
            ),
            onConcluir = {},
            onAtualizar = {},
        )
    }
}
