class PlainChordUtils {
    static cleanLines(plainText) {
      return plainText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }
  
    static extractTitleAndArtist(lines) {
      const title = lines.length > 0 ? lines.shift() : 'Chord';
      const artist = lines.length > 0 ? lines.shift() : '-';
      return { title, artist };
    }
  
    static extractCapo(lines) {
      const capoMatch = lines.find(line => /^#(\d+)$/.test(line));
      if (capoMatch) {
        const capo = parseInt(capoMatch.match(/^#(\d+)$/)[1], 10);
        lines.splice(lines.indexOf(capoMatch), 1);
        return capo;
      }
      return null;
    }
  
    static createSection(title, repeat) {
      return {
        lyrics: [{ title: title.trim(), chords: [], repeat: repeat ? parseInt(repeat, 10) : 0 }]
      };
    }
  
    static parseChordsLine(line) {
      const chords = [];
      let currentChord = null;
      
      line.split(/\s+/).filter(Boolean).forEach(item => {
        if (item.startsWith('$')) {
          if (currentChord) {
            chords.push(currentChord);
          }
          const chordMatch = item.match(/^\$(\S+)(.*)$/);
          if (chordMatch) {
            currentChord = { chord: chordMatch[1], lyrics: chordMatch[2].trim() };
          }
        } else {
          if (currentChord) {
            currentChord.lyrics += ' ' + item.trim();
          } else {
            currentChord = { lyrics: item.trim(), chord: '$$' };
          }
        }
      });
      
      if (currentChord) {
        chords.push(currentChord);
      }
      
      return chords;
    }
  
    static parseChord(plainText) {
      const lines = this.cleanLines(plainText);
  
      const { title, artist } = this.extractTitleAndArtist(lines);
      const capo = this.extractCapo(lines);
  
      const sections = [];
      let currentSection = null;
      let currentPart = null;
      let needsDoubleDollar = false;
  
      lines.forEach(line => {
        const sectionMatch = line.match(/^@(.*?)\s*(?:x(\d+))?$/);
        if (sectionMatch) {
          const [, sectionTitle, repeat] = sectionMatch;
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = this.createSection(sectionTitle, repeat);
          currentPart = currentSection.lyrics[0];
          needsDoubleDollar = true;
          return;
        }
  
        if (line) {
          const chords = this.parseChordsLine(line);
          if (chords.length > 0) {
            currentPart.chords.push(chords);
            needsDoubleDollar = false;
          } else if (needsDoubleDollar) {
            const lyrics = line.split(/\s+/).filter(Boolean).join(' ');
            if (lyrics) {
              currentPart.chords.push([{ lyrics: `$$ ${lyrics}` }]);
              needsDoubleDollar = false;
            }
          }
        }
      });
  
      if (currentSection) {
        sections.push(currentSection);
      }
  
      return {
        title,
        artist,
        capo,
        sections
      };
    }
  
    static stringifyChord(songData) {
      let plainText = `${songData.title}\n${songData.artist}\n`;
  
      plainText += songData.capo === null || songData.capo === undefined ? '#0\n' : `#${songData.capo}\n`;
      plainText += '\n';
  
      songData.sections.forEach(section => {
        section.lyrics.forEach(part => {
          let sectionTitle = `@${part.title}`;
          if (part.repeat > 0) {
            sectionTitle += ` x${part.repeat}`;
          }
          plainText += `${sectionTitle}\n`;
  
          part.chords.forEach(chordLine => {
            let line = chordLine.map(chordObj => {
              if (chordObj.chord) {
                return `$${chordObj.chord}${chordObj.lyrics ? '' + chordObj.lyrics : ''}`;
              }
            }).join(' ');
  
            plainText += `${line}\n`;
          });
  
          plainText += '\n';
        });
      });
  
      return plainText.trim().replaceAll('$$$', ''); // Selah
    }
  
    static validateChordObject(songData) {
      if (!songData.sections || songData.sections.length === 0) {
        return false;
      }
  
      for (const section of songData.sections) {
        if (!section.lyrics || section.lyrics.length === 0) {
          return false;
        }
  
        for (const part of section.lyrics) {
          if (!part.title || !part.chords || part.chords.length === 0) {
            return false;
          }
  
          for (const chordLine of part.chords) {
            if (chordLine.length === 0) {
              return false;
            }
          }
        }
      }
  
      return true;
    }
  
    static validatePlainChord(plain) {
      return this.validateChordObject(this.parseChord(plain));
    }
  
    static extractUniqueChords(data) {
      const uniqueChords = new Set();
  
      data.forEach(item => {
        item.lyrics.forEach(section => {
          section.chords.forEach(chordArray => {
            chordArray.forEach(chordObj => {
              uniqueChords.add(chordObj.chord);
            });
          });
        });
      });
  
      return Array.from(uniqueChords);
    }
  }
  
  export default PlainChordUtils;
  