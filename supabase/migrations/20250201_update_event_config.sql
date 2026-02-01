-- Altera o tipo da coluna event_date para TEXT (para suportar formato "21 de Fevereiro de 2025")
ALTER TABLE event_config ALTER COLUMN event_date TYPE TEXT;

-- Atualiza endereco e horario do evento
UPDATE event_config SET
  event_address_full = 'Rua do Bosque, 130 - Barra Funda (Salão de Festas)',
  event_date = '21 de Fevereiro de 2025',
  event_time = '16h',
  updated_at = NOW();
