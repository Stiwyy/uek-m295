import { readFile } from 'node:fs';
function leseDateiInhalt(dateiPfad) {
  return new Promise((resolve, reject) => {
    readFile(dateiPfad, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

leseDateiInhalt('2-2_promises/beispiel.txt')
  .then(inhalt => { console.log('Die Länge des Dateiinhalts beträgt:', inhalt.length);
})
  .catch(err => { console.error('Fehler beim Lesen der Datei:', err);
});