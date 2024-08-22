
export const diatonicChords = {
    "C": ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
    "G": ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
    "D": ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
    "A": ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
    "E": ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
    "B": ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
    "F#": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
    "C#": ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"],
    "F": ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
    "Bb": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
    "Eb": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
    "Ab": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
    "Db": ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
    "Gb": ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"]
};

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const intervals = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    dominant: [0, 4, 7, 10],
    major7: [0, 4, 7, 11],
    minor7: [0, 3, 7, 10],
    maj7: [0, 4, 7, 11],
    dominant7: [0, 4, 7, 10],
    major6: [0, 4, 7, 9],
    minor6: [0, 3, 7, 9],
    major9: [0, 4, 7, 11, 14],
    dominant9: [0, 4, 7, 10, 14],
    minor9: [0, 3, 7, 10, 14],
    major11: [0, 4, 7, 11, 14, 17],
    dominant11: [0, 4, 7, 10, 14, 17],
    minor11: [0, 3, 7, 10, 14, 17],
    major13: [0, 4, 7, 11, 14, 21],
    dominant13: [0, 4, 7, 10, 14, 21],
    minor13: [0, 3, 7, 10, 14, 21],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    diminished: [0, 3, 6],
    halfDiminished: [0, 3, 6, 10],
    fullyDiminished: [0, 3, 6, 9]
};

export const qualityMap = {
    'maj': 'major',
    'min': 'minor',
    '7': 'dominant',
    'maj7': 'major7',
    'm7': 'minor7',
    'maj6': 'major6',
    'm6': 'minor6',
    '9': 'dominant9',
    'maj9': 'major9',
    'm9': 'minor9',
    '11': 'dominant11',
    'maj11': 'major11',
    'm11': 'minor11',
    '13': 'dominant13',
    'maj13': 'major13',
    'm13': 'minor13',
    'sus2': 'suspended2',
    'sus4': 'suspended4',
    'dim': 'diminished',
    'dim7': 'fullyDiminished',
    'halfDim': 'halfDiminished'
};