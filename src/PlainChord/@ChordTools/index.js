import { diatonicChords, notes, intervals, qualityMap } from "./constants";

class ChordTools {
    static diatonicChords = diatonicChords;
    static notes = notes;
    static intervals = intervals;
    static qualityMap = qualityMap;

    static getChordName(notesArray) {
        if (notesArray.length === 0) return 'No notes provided';

        const rootNote = notesArray[0];
        const rootIndex = this.notes.indexOf(rootNote);

        if (rootIndex === -1) return 'Invalid root note';

        const normalizedNotes = notesArray.map(note => this.notes[(this.notes.indexOf(note) - rootIndex + 12) % 12]);

        for (const [quality, intervalsArray] of Object.entries(this.intervals)) {
            const chordIntervals = new Set(intervalsArray.map(i => (i + rootIndex) % 12));
            const providedIntervals = new Set(normalizedNotes.map(note => this.notes.indexOf(note)));

            if ([...chordIntervals].every(i => providedIntervals.has(i))) {
                let chordName = rootNote + quality || 'Unknown chord';
                const extraNotes = normalizedNotes.filter(note => !chordIntervals.has(this.notes.indexOf(note)));

                if (extraNotes.length > 0) {
                    chordName += extraNotes.map(note => `(${note})`).join('');
                }

                return chordName;
            }
        }

        return 'Unknown chord';
    }

    static getChordNotes({ rootNote, quality, extensionType }) {
        const chordType = this.qualityMap[quality] || 'major';
        const chordIntervals = this.intervals[chordType] || this.intervals['major'];

        const rootIndex = this.notes.indexOf(rootNote);
        if (rootIndex === -1) {
            throw new Error("Invalid root note");
        }

        const chordNotes = chordIntervals.map(interval => this.notes[(rootIndex + interval) % 12]);

        if (extensionType) {
            const extensionIntervals = {
                '9': [2],
                '11': [5],
                '13': [9]
            };

            const extensionNotes = extensionIntervals[extensionType] || [];
            extensionNotes.forEach(interval => {
                const noteIndex = (rootIndex + interval) % 12;
                const note = this.notes[noteIndex];
                if (!chordNotes.includes(note)) {
                    chordNotes.push(note);
                }
            });
        }

        return chordNotes;
    }

    static generateFretboard(tuning) {
        const fretboard = [];
        let validStrings = 0;

        for (let i = 0; i < tuning.length; i++) {
            const stringNote = tuning[i];
            const startIndex = this.notes.indexOf(stringNote);

            if (startIndex !== -1) {
                const stringFretboard = this.notes.slice(startIndex).concat(this.notes.slice(0, startIndex));
                fretboard.push(stringFretboard);
                validStrings += 1;
            }
        }

        return { fretboard, validStrings };
    }

    static getChordTones(tonic, isMajor = true) {
        const tonicIndex = this.notes.indexOf(tonic);
        const intervals = isMajor ? [4, 3] : [3, 4];

        const chordTones = [
            tonic,
            this.notes[(tonicIndex + intervals[0]) % 12],
            this.notes[(tonicIndex + intervals[1]) % 12]
        ];

        return chordTones;
    }

    static parseChord(chord) {
        const chordRegex = /^([A-Ga-g#b]+)([mM]?[7]?[a-zA-Z]*)(\d*|9|11|13)?([b#]*)([0-9]*)?([a-zA-Z]*)$/;

        const match = chord.match(chordRegex);

        if (!match) {
            throw new Error("Invalid chord format");
        }

        return {
            root: match[1],
            quality: match[2],
            extension: match[3],
            accidental: match[4],
            modifier: match[5],
            bass: match[6]
        };
    }

    static getDiatonicChords(tonic, scaleType = "major") {
        const scale = this.diatonicChords[scaleType];
        const tonicIndex = this.notes.indexOf(tonic);

        if (tonicIndex === -1) {
            throw new Error("Invalid tonic note");
        }

        return scale.map((interval, i) => {
            const note = this.notes[(tonicIndex + interval) % 12];
            return `${note}${this.qualityMap[scaleType][i]}`;
        });
    }

    static generateChordCandidates(notesArray) {
        const candidates = [];

        this.notes.forEach(rootNote => {
            Object.keys(this.qualityMap).forEach(quality => {
                const chordNotes = this.getChordNotes({ rootNote, quality });

                if (notesArray.every(note => chordNotes.includes(note))) {
                    candidates.push(`${rootNote}${quality}`);
                }
            });
        });

        return candidates;
    }

    static simplifyChord(chord) {
        return chord.replace(/add|sus|maj|min|dim|aug|M|m/g, '').trim();
    }

    static transposeChords(chords, steps) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        function transposeChord(chord, steps) {
            const [chordPart, bassPart] = chord.split('/');
            const noteMatch = chordPart.match(/[A-G][b#]?/);
            if (!noteMatch) return chord;

            const rootNote = noteMatch[0];
            const otherParts = chordPart.slice(rootNote.length);

            const index = notes.indexOf(rootNote);
            if (index === -1) return chord;

            const newIndex = (index + steps + notes.length) % notes.length;
            const newRootNote = notes[newIndex];

            const transposedBass = bassPart ? notes[(notes.indexOf(bassPart) + steps + notes.length) % notes.length] : '';

            return newRootNote + otherParts + (transposedBass ? `/${transposedBass}` : '');
        }

        if (!Array.isArray(chords)) {
            throw new TypeError('Expected chords to be an array');
        }

        return chords.map(chord => transposeChord(chord, steps));
    }

    static getMainTonality(chords) {
        const chordCounts = {};

        chords.forEach(chord => {
            const simplifiedChord = this.simplifyChord(chord);
            chordCounts[simplifiedChord] = (chordCounts[simplifiedChord] || 0) + 1;
        });

        const dominantChord = Object.keys(chordCounts).reduce((a, b) => chordCounts[a] > chordCounts[b] ? a : b, null);

        for (const [tonality, chordsInTonalidade] of Object.entries(this.diatonicChords)) {
            if (chordsInTonalidade.includes(dominantChord)) {
                return tonality;
            }
        }

        return "Unknown";
    }

    static generateChordASCII(chord) {
        if (typeof chord !== 'string' || chord.length !== 6) {
            return;
        }
    
        const strings = ['E', 'A', 'D', 'G', 'B', 'e'];
        const maxFrets = 4;
        let chordLines = [];
    
        for (let i = 0; i < strings.length; i++) {
            let fret = chord[i];
            let chordLine = `${strings[i]}|`;
    
            for (let j = 1; j <= maxFrets; j++) {
                if (fret === 'x') {
                    chordLine += '---x---|';
                } else if (parseInt(fret, 10) === j) {
                    chordLine += '---' + fret + '---|';
                } else {
                    chordLine += '-------|';
                }
            }
    
            if (fret !== 'x' && parseInt(fret, 10) > maxFrets) {
                chordLine = `${strings[i]}|` + '-------|'.repeat(maxFrets - 1) + '---' + fret + '---|';
            }
    
            chordLines.push(chordLine);
        }
    
        return chordLines.join('\n');
    }
    
}

export default ChordTools;
