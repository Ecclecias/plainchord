import React from 'react';

import ChordTools from '../../../@ChordTools';
import getChordsCode from '../../../@ChordTools/chordsCode';

import './ChordPopup.css';

const ChordPopup = ({ chord, onClose }) => {
    const getChordVariations = (chord) => {
        const variations = [];
        const chordCode = getChordsCode(chord);

        if (chordCode) {
            chordCode.forEach((variation, index) => {
                variations.push({ 
                    label: index === 0 ? 'Standard' : `Shape ${index}`, 
                    code: ChordTools.generateChordASCII(variation) 
                });
            });
        }
        return variations;
    };

    const chordVariations = getChordVariations(chord);

    return (
        <div className="chord-popup">
            <div className="chord-popup-content">
                <button className="chord-popup-close" onClick={onClose}>✕</button>
                <h3 className='chord'>{chord}</h3>
                <div className="chord-popup-body">
                    {chordVariations.length ? (
                        chordVariations.map((variation, index) => (
                            <div key={index} className="chord-variation">
                                <h4>{variation.label}</h4>
                                <pre>{variation.code}</pre>
                            </div>
                        ))
                    ) : (
                        <p>No variations available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChordPopup;
