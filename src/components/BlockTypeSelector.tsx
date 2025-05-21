import { CellType } from '../types';
import { CELL_TYPES } from '../constants';
import { Apple, Flag, PlayCircle, Shield, ShieldBan } from 'lucide-react';

interface BlockTypeSelectorProps {
    selected: CellType;
    onSelect: (type: CellType) => void;
}

const cellIcons: Record<string, React.ReactNode> = {
        'C': <PlayCircle size={20} />,
        'S': <Flag size={20} />,
        'B': <ShieldBan size={20} />,
        'A': <Shield size={20} />,
        'F': <Apple size={20} />,
        '_': null,
};

const blockTypes: CellType[] = ['C', '_', 'B', 'F', 'A', 'S'];

const BlockTypeSelector: React.FC<BlockTypeSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div className="flex gap-2 items-center">
            {blockTypes.map(type => (
                <button
                    key={type}
                    className={`w-10 h-10 rounded-md border-2 flex text-black items-center justify-center font-bold text-xs transition-all duration-200 ${selected === type ? 'border-yellow-400 scale-110' : 'border-transparent'} ${CELL_TYPES[type].color}`}
                    title={CELL_TYPES[type].name}
                    onClick={() => onSelect(type)}
                >
                    {cellIcons[type]}
                </button>
            ))}
        </div>
    );
};

export default BlockTypeSelector;
