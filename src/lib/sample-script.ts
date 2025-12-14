// Sample 30-second commercial script data
// Structure inspired by A/V dual-column screenplay format

export interface ScriptBlock {
    id: string
    timecode: string
    visual: string
    audio: string
    notes?: string
}

export interface Script {
    id: string
    title: string
    client: string
    version: string
    duration: string
    lastUpdated: string
    status: 'draft' | 'review' | 'approved'
    blocks: ScriptBlock[]
}

export const sampleScript: Script = {
    id: 'script-001',
    title: 'Horizon Coffee — "First Light"',
    client: 'Horizon Coffee Co.',
    version: 'v2.3',
    duration: ':30',
    lastUpdated: '2024-12-14',
    status: 'review',
    blocks: [
        {
            id: 'block-1',
            timecode: '00:00 - 00:05',
            visual: 'FADE IN on a misty mountain valley at dawn. Golden light breaks through the clouds. A single coffee plant emerges from the fog.',
            audio: '(Natural ambience: distant birdsong, gentle wind)',
            notes: 'Shot in Oaxaca, Mexico. Magic hour lighting critical.',
        },
        {
            id: 'block-2',
            timecode: '00:05 - 00:10',
            visual: 'CLOSE-UP: Weathered hands carefully selecting ripe coffee cherries. Each movement deliberate, almost reverent.',
            audio: 'VO: "Some mornings demand more than coffee."',
        },
        {
            id: 'block-3',
            timecode: '00:10 - 00:15',
            visual: 'MONTAGE: Steam rising from roasting beans. The cascade of freshly ground coffee. A precise pour-over in progress.',
            audio: 'VO: "They demand a ritual."',
            notes: 'Macro shots. Slow motion at 120fps.',
        },
        {
            id: 'block-4',
            timecode: '00:15 - 00:22',
            visual: 'WIDE: Modern kitchen bathed in morning light. A person savors their first sip, eyes closed. The world outside comes alive.',
            audio: '(Soft, minimal piano begins) VO: "Horizon Coffee. Where every cup is the first light of something new."',
        },
        {
            id: 'block-5',
            timecode: '00:22 - 00:30',
            visual: 'PRODUCT SHOT: Horizon Coffee bag with steam wisping past. Logo reveals. END CARD: "horizoncoffee.com"',
            audio: '(Piano resolves) SFX: Gentle cup set-down.',
            notes: 'End card holds for 3 seconds minimum.',
        },
    ],
}
