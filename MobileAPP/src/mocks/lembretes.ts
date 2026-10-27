// Dados de demonstração até existir o store de lembretes (cartão "Criar dados mockados").

export type Lembrete = {
  id: string;
  titulo: string;
  horario: string;
  dia: 'Hoje' | 'Amanhã';
  concluido: boolean;
};

export const LEMBRETES: Lembrete[] = [
  { id: '1', titulo: 'Tomar Remédio', horario: '08:00', dia: 'Hoje', concluido: true },
  { id: '2', titulo: 'Regar plantas', horario: '10:00', dia: 'Hoje', concluido: true },
  { id: '3', titulo: 'Tomar Remédio', horario: '14:00', dia: 'Hoje', concluido: true },
  { id: '4', titulo: 'Lavar roupas', horario: '18:00', dia: 'Amanhã', concluido: false },
];
