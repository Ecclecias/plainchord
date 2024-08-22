import React, { useState, useEffect } from 'react';
import './ChordViewer.css';
import PlainChord from '../index.js';
import Chords from './components/Chords/index.js';

const ChordTextarea = ({ chordText, onChordTextChange, onViewClick }) => (
    <div className="input-group">
        <h3>PlainChord:</h3>
        <textarea
            className="text-area"
            value={chordText}
            onChange={(e) => onChordTextChange(e.target.value)}
            placeholder="Your Chords"
        />
        <button onClick={onViewClick} className="action-button">
            View
        </button>
    </div>
);

const CIDInput = ({ cID, onCIDChange }) => (
    <div className="input-group">
        <h3>BTFS Content ID:</h3>
        <input
            type="text"
            placeholder="QmZteiNT4WNyhmVzVz9BSuQscrQXJbCDcvEqnU6RxxCYpu"
            value={cID}
            onChange={(e) => onCIDChange(e.target.value)}
            className="input-field"
        />
    </div>
);

const FileUpload = ({ onFileUpload, onFileLoad }) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => onFileUpload(e.target.result);
            reader.readAsText(file);
        }
    };

    return (
        <div className="input-group">
            <h3>Upload .PlainChord or .Chord:</h3>
            <input
                type="file"
                accept=".plainchord,.chord"
                onChange={handleFileUpload}
                className="file-input"
            />
            <button onClick={onFileLoad} className="action-button">
                Load
            </button>
        </div>
    );
};

const ChordViewer = () => {
    const [chordText, setChordText] = useState('');
    const [chordData, setChordData] = useState(null);
    const [cID, setCID] = useState('');
    const [fileContent, setFileContent] = useState('');

    const gatewayUrl = (cid) => `https://gateway.btfs.io/btfs/${cid}`;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        const cidFromUrl = urlParams.get('cid');
        const chordTextFromUrl = urlParams.get('chord');

        if (cidFromUrl) setCID(cidFromUrl);

        if (chordTextFromUrl) {
            const decodedChord = decodeURIComponent(chordTextFromUrl);
            setChordText(decodedChord);
        }
    }, []);

    useEffect(() => {
        if (cID) {
            fetch(gatewayUrl(cID))
                .then(response => response.text())
                .then(data => {
                    setChordText(data);
                })
                .catch(error => console.error('Error fetching PlainChord:', error));
        }
    }, [cID]);

    const updateUrlParams = (newChordText, newCID) => {
        const params = new URLSearchParams();
        if (newCID) params.set('cid', newCID);
        else if (newChordText) params.set('chord', encodeURIComponent(newChordText));

        window.history.replaceState(null, '', `?${params.toString()}`);
    };

    const parseChordText = (text) => {
        try {
            const parsedData = PlainChord.parseChord(text || chordText);
            setChordData(parsedData);
            updateUrlParams(text || chordText, cID);
        } catch (error) {
            console.error('Erro ao parsear cifra:', error);
        }
    };

    return (
        <div className="chord-viewer-container">
            {!chordData && (
                <>
                    <CIDInput cID={cID} onCIDChange={setCID} />
                    <hr />
                    <FileUpload onFileUpload={(content) => setFileContent(content)} onFileLoad={() => setChordText(fileContent)} />
                    <hr />
                    <ChordTextarea chordText={chordText} onChordTextChange={setChordText} onViewClick={() => parseChordText()} />
                </>
            )}
            {chordData && <Chords data={chordData} />}
        </div>
    );
};

export default ChordViewer;
