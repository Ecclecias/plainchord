import React, { useState, useEffect } from 'react';

import getChordsCode from '../../../@ChordTools/chordsCode';
import ChordTools from '../../../@ChordTools';
import PlainChord from '../../..';
import ChordPopup from '../ChordPopup';

import './Chords.css';

const tonalities = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const Chords = ({ data, ...opts }) => {
    const { title, artist, sections, capo } = data;
    const {
        showOutput = false,
        showTonality = false,
        showTitle = false,
        showArtist = false,
        showASCIIChords = true,
        showMusicTonality = false,
        showBack = false,
        showChord = true
    } = opts;

    const [selectedTonality, setSelectedTonality] = useState('C');
    const [originalTonality, setOriginalTonality] = useState(null);
    const [transposedSections, setTransposedSections] = useState(sections);
    const [plaintextOutput, setPlaintextOutput] = useState('');

    const [copyMessageVisible, setCopyMessageVisible] = useState(false);

    const handleDownload = () => {
        const blob = new Blob([plaintextOutput]);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '-')}.plainchord`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getOriginalTonality = () => {
        const chords = [];
        sections.forEach(section => {
            if (section.lyrics) {
                section.lyrics.forEach(part => {
                    if (part.chords) {
                        part.chords.forEach(line => {
                            if (Array.isArray(line)) {
                                line.forEach(item => {
                                    if (item.chord) {
                                        chords.push(item.chord);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        return ChordTools.getMainTonality(chords);
    };

    useEffect(() => {
        const originalTonality = getOriginalTonality();
        setOriginalTonality(originalTonality);
        setSelectedTonality(originalTonality);
        const updatedSections = transposeToTonality(sections, originalTonality, originalTonality);
        setTransposedSections(updatedSections);
    }, [sections]);

    useEffect(() => {
        const generatePlaintext = () => PlainChord.stringifyChord({ title, artist, sections: transposedSections });
        setPlaintextOutput(generatePlaintext());
    }, [transposedSections, title, artist]);

    const getTransposeSteps = (original, target) => {
        return (tonalities.indexOf(target) - tonalities.indexOf(original) + 12) % 12;
    };

    const transposeToTonality = (sections, originalTonality, targetTonality) => {
        const chords = [];
        if (sections) {
            sections.forEach(section => {
                if (section.lyrics) {
                    section.lyrics.forEach(part => {
                        if (part.chords) {
                            part.chords.forEach(line => {
                                if (Array.isArray(line)) {
                                    line.forEach(item => {
                                        if (item.chord) {
                                            chords.push(item.chord);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        const steps = getTransposeSteps(originalTonality, targetTonality);
        const transposedChords = ChordTools.transposeChords(chords, steps);
        const updatedSections = sections.map(section => ({
            ...section,
            lyrics: section.lyrics.map(part => ({
                ...part,
                chords: part.chords.map(line =>
                    line.map(item => ({
                        ...item,
                        chord: transposedChords.shift() || item.chord
                    }))
                )
            }))
        }));
        return updatedSections;
    };

    const handleTonalityChange = (tonality) => {
        if (tonality === selectedTonality) return;
        setSelectedTonality(tonality);
        const updatedSections = transposeToTonality(sections, originalTonality, tonality);
        setTransposedSections(updatedSections);
    };

    const renderLine = (line) => {
        return (
            <div className="grid-container">
                {line.map((item, index) => (
                    <div className="grid-item" key={index}>
                        {item.chord && item.chord !== "$$" ? <div className="chord" onClick={() => setPopupChord(item.chord)}>{item.chord}</div> : <br />}
                        {item.lyrics && <div className="lyrics">{item.lyrics}</div>}
                    </div>
                ))}
            </div>
        );
    };

    const handleCopy = (isLink = false) => {
        const copyText = isLink ? document.location.href : plaintextOutput;
        navigator.clipboard.writeText(copyText).then(() => {
            setCopyMessageVisible(true);
            setTimeout(() => setCopyMessageVisible(false), 2000);
        });
    };

    const handleBackButton = () => {
        const urlParams = new URLSearchParams(window.location.search);
        window.history.replaceState(null, '', `?${urlParams.toString()}`);
        window.location.reload();
    };

    const [popupChord, setPopupChord] = useState(null);

    return (
        <div className="chords-container">
            {showBack && (
                <a href="#" className="back-link" onClick={handleBackButton}>
                    <span className="back-arrow">&#8592;</span> Back
                </a>
            )}

            {showTitle && <div className="chords-title">{title}</div>}
            {showArtist && <div className="chords-artist">{artist}</div>}

            {showMusicTonality && (
                <div className='music-chords'>
                    {PlainChord.extractUniqueChords(transposedSections).map((chord, index) => chord !== "$$" && (
                        <div key={index} onClick={() => setPopupChord(chord)}>
                            <b className='chord'>{chord}</b>
                        </div>
                    ))}
                </div>
            )}

            {showTonality && (
                <div className="tonality-buttons">
                    {tonalities.map(tonality => (
                        <button
                            key={tonality}
                            className={`tonality-button ${tonality === selectedTonality ? 'active' : ''}`}
                            onClick={() => handleTonalityChange(tonality)}
                            disabled={tonality === selectedTonality || originalTonality === "Unknown"}
                        >
                            {tonality}
                        </button>
                    ))}
                </div>
            )}

            {showChord && (<>
                {capo > 0 && <div className="capo">Capo: <span>{capo}ª</span></div>}

                {transposedSections.map((section, sectionIndex) => (
                    <div className="section" key={sectionIndex}>
                        {section.lyrics.map((part, partIndex) => (
                            <div className="part" key={partIndex}>
                                <span className="part-repeat">
                                    {!part.repeat ? '1x' : `${part.repeat}x`}
                                </span>
                                <div className="part-title">{part.title}</div>
                                {part.chords.map((line, lineIndex) => (
                                    <div className="line" key={lineIndex}>
                                        {renderLine(line)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </>)
            }

            {showASCIIChords && (
                <>
                    <h3>Chords:</h3>
                    <div className='chords-ascii'>
                        {PlainChord.extractUniqueChords(transposedSections).map((chord, index) => chord !== "$$" && (
                            <div key={index} className="chord-container" onClick={() => setPopupChord(chord)}>
                                <b className='chord'>{chord}</b>
                                <pre>{ChordTools.generateChordASCII(getChordsCode(chord)?.[0])}</pre>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {popupChord && (
                <ChordPopup chord={popupChord} onClose={() => setPopupChord(null)} />
            )}

            {showOutput && (
                <>
                    <h3>Output:</h3>
                    <div className="plaintext-output-container">
                        <textarea
                            className="plaintext-output"
                            value={plaintextOutput}
                            readOnly
                        />
                        <div className="action-buttons">
                            <div>
                                <button className="action-button" onClick={() => handleCopy(false)}>
                                    Copy
                                </button>
                                <button className="action-button" onClick={handleDownload}>
                                    Download
                                </button>
                                <button className="action-button" onClick={() => handleCopy(true)}>
                                    Share
                                </button>
                            </div>
                            {copyMessageVisible && <div className="copy-message">Copied!</div>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chords;
