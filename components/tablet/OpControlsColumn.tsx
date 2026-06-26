// Referência: docs/parte_diaria_v46.html linhas 1634–1648 / 1780–1792
// Coluna de controles operacionais compartilhada por Truck, Loader e Excavator.
// Esquerda inferior: ENTRADA ESTOQUE + botão de PARADA.

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PetraIcon } from '@/components/petra/PetraIcon';
import { StopButton } from '@/components/tablet/StopButton';
import { useTabletStore } from '@/lib/store/tabletStore';

export type OpControlsColumnProps = {
  className?: string;
  onStockIn?: () => void;
};

export const OpControlsColumn: React.FC<OpControlsColumnProps> = ({ className, onStockIn }) => {
  const activeStop = useTabletStore(s => s.session.activeStop);
  const startStop  = useTabletStore(s => s.startStop);
  const endStop    = useTabletStore(s => s.endStop);

  const handleStopPress = () => (activeStop ? endStop() : startStop());

  return (
    <div className={cn('flex min-h-0 flex-col gap-2', className)}>
      <Button
        variant="ghost"
        onClick={onStockIn}
        className="flex-1 h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-tablet-border bg-tablet-surface-2 whitespace-normal hover:bg-tablet-surface-3 active:scale-[0.98]"
      >
        <PetraIcon name="inbound" size={30} className="text-tablet-text-dim" />
        <span className="text-sm font-black tracking-wide text-tablet-text">ENTRADA ESTOQUE</span>
      </Button>

      <StopButton
        className="flex-1"
        isActive={!!activeStop}
        startTs={activeStop?.startTs}
        onClick={handleStopPress}
      />
    </div>
  );
};
