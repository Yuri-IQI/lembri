# Exportação e Compartilhamento de Dados — Projeto Lembri

Este documento descreve as diretrizes para exportação, backup local e compartilhamento de listas de lembretes e tarefas no aplicativo mobile **Lembri**.

---

## 1. Exportação e Compartilhamento Mobile

No contexto de um aplicativo focado no front-end, a exportação de dados é realizada utilizando recursos nativos do dispositivo:
- **Compartilhamento de Lembretes via API Nativa (`Share`):** Permite enviar a lista de lembretes ou resumo de tarefas diárias para outros aplicativos (WhatsApp, e-mail, notas) via `Share.share({ message })` do React Native.
- **Backup e Restauração de Mocks (JSON):** Capacidade de exportar o estado atual das stores do Zustand em formato JSON para fins de depuração ou compartilhamento de cenários de teste entre desenvolvedores.

---

## 2. Padrão de Formatação para Compartilhamento

As mensagens de texto geradas para compartilhamento devem ser claras, legíveis e organizadas:

```ts
export function formatarLembretesParaCompartilhar(lembretes: Lembrete[]): string {
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const linhas = lembretes.map(
    (item) => `${item.concluido ? '✓' : '□'} [${item.horario}] ${item.titulo}`
  );

  return `Lembri — Tarefas de ${dataHoje}\n\n${linhas.join('\n')}`;
}
```

---

## 3. Acessibilidade na Exportação

- O botão de compartilhamento deve conter `accessibilityRole="button"` e `accessibilityLabel="Compartilhar lista de lembretes"`.
- As mensagens de confirmação de sucesso ou falha no compartilhamento devem ser anunciadas ao usuário através de feedback visual ou sonoro.
