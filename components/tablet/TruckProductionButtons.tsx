// Referência: docs/parte_diaria_v46.html linhas 1526–1551 — renderTruckOps()
// Botões primários de produção do caminhão: BASCULAMENTO e DECAPE.
// Lê estado e dispara ações diretamente do store do tablet.

import { cn } from '@/lib/utils';
import { PetraIcon } from '@/components/petra/PetraIcon';
import {
  useTabletStore,
  selectProductiveTrips,
} from '@/lib/store/tabletStore';

export type TruckProductionButtonsProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const TruckProductionButtons: React.FC<TruckProductionButtonsProps> = ({ className, style }) => {
  const stopActive = useTabletStore(s => !!s.session.activeStop);
  const registerTrip = useTabletStore(s => s.registerTrip);
  const productive = useTabletStore(selectProductiveTrips);

  const handleProductive = () => registerTrip('productive');
  const handleSterile = () => registerTrip('sterile');

  return (
    <div className={cn('flex min-h-0 flex-col gap-2', className)} style={style}>
      <button
        type="button"
        onClick={handleProductive}
        disabled={stopActive}
        aria-label="Registrar basculamento produtivo no britador primário"
        className={cn(
          'flex min-h-0 flex-col items-center justify-center gap-2 rounded-2xl font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40',
          stopActive
            ? 'bg-op-green/50'
            : 'bg-op-green shadow-xl shadow-op-green/30 hover:bg-op-green-dark'
        )}
        style={{ flex: 3 }}
      >
        <PetraIcon name="dump" size={56} />
        <span className="font-display text-3xl leading-tight">BASCULAMENTO</span>
        <span className="text-base font-semibold opacity-90">no Primário</span>
        {productive.length > 0 && (
          <span className="font-mono text-sm font-bold tabular-nums opacity-75">
            {productive.length} viagens hoje
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={handleSterile}
        disabled={stopActive}
        aria-label="Registrar viagem de decape"
        className={cn(
          'flex min-h-0 flex-row items-center justify-center gap-3 rounded-2xl font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40',
          stopActive
            ? 'bg-op-red/50'
            : 'bg-op-red shadow-xl shadow-op-red/30 hover:bg-op-red-dark'
        )}
        style={{ flex: 1 }}
      >
        <PetraIcon name="decape" size={34} />
        <div>
          <div className="font-display text-2xl leading-tight">DECAPE</div>
          <div className="text-sm font-semibold opacity-90">Material de decape</div>
        </div>
      </button>
    </div>
  );
};
