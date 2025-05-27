import { ColumnDef } from '@tanstack/react-table';

export type Case = {
    id: number;
    convictId: number;
    investigatorId: number;
    status: string;
    convictName: string;
    investigatorName: string;
    date: string | null;
    sentence: {
        type: string;
        startDate: string;
        endDate: string | null;
        termYears: number | null;
        location: string | null;
    } | null;
};

export const columns: ColumnDef<Case>[] = [
    {
        accessorKey: 'id',
        header: 'Номер',
    },
    {
        accessorKey: 'convictName',
        header: 'Засуджений',
    },
    {
        accessorKey: 'investigatorName',
        header: 'Слідчий',
    },
    {
        accessorKey: 'date',
        header: 'Дата справи',
        cell: ({ row }) => {
            const date = row.getValue('date') as string | null;
            if (!date) return '-';
            return new Date(date).toLocaleDateString('uk-UA');
        },
    },
    {
        accessorKey: 'status',
        header: 'Статус',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusMap: Record<string, string> = {
                active: 'Активна',
                closed: 'Закрита',
                pending: 'Очікує розгляду',
            };
            return statusMap[status] || status;
        },
    },
    {
        accessorKey: 'sentence',
        header: 'Вирок',
        cell: ({ row }) => {
            const sentence = row.getValue('sentence') as Case['sentence'];
            if (!sentence) return '-';

            const typeMap: Record<string, string> = {
                imprisonment: 'Позбавлення волі',
                correctional: 'Виправні роботи',
                conditional: 'Умовне',
                fine: 'Штраф',
            };

            const type = typeMap[sentence.type] || sentence.type;
            const startDate = new Date(sentence.startDate).toLocaleDateString(
                'uk-UA'
            );
            const endDate = sentence.endDate
                ? new Date(sentence.endDate).toLocaleDateString('uk-UA')
                : null;
            const term = sentence.termYears
                ? `${sentence.termYears} років`
                : null;
            const location = sentence.location || null;

            return (
                <div className="space-y-2">
                    <div className="font-medium">{type}</div>
                    <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Період:</span>
                            <span>
                                {startDate} - {endDate || 'Не вказано'}
                            </span>
                        </div>
                        {term && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Термін:</span>
                                <span>{term}</span>
                            </div>
                        )}
                        {location && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">
                                    {sentence.type === 'fine'
                                        ? 'Статус:'
                                        : 'Місце:'}
                                </span>
                                <span>{location}</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        },
    },
];
