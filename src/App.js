// Prime CSSs
import 'primereact/resources/themes/arya-orange/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // primeflex

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useCallback, useMemo, useState } from 'react';

function App() {

  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({ value: '', points: 0 });

  const addWord = useCallback(() => {
    if (newWord.value === '' || newWord.points === 0) {
      return;
    }

    setWords([
      ...words,
      newWord
    ]);

    setNewWord({ value: '', points: 0 });
  }, [newWord, words]);

  const calculePoints = useCallback(word => {
    let points = 0;

    const letterPoints = {
      10: ['Q', 'Z', '_'],
      8: ['X', 'J'],
      5: ['K'],
      4: ['F', 'H', 'V', 'W'],
      3: ['B', 'C', 'M', 'P'],
      2: ['D', 'G']
    }

    if (word) {
      for (let i = 0; i < word.length; i++) {
        let defaultPoints = false;
        // eslint-disable-next-line no-loop-func
        Object.entries(letterPoints).forEach(([key, value]) => {
          if (value.includes(word[i])) {
            points = points + parseInt(key);
            defaultPoints = true;
          }
        });

        if (!defaultPoints) {
          points = points + 1;
        }
      }
    }

    return points;
  }, []);

  const onChangeNewWork = useCallback(e => {
    let value = e.target.value ?? '';

    if (value) {
      value = value.toUpperCase();
    }

    const points = calculePoints(value);

    setNewWord({
      value,
      points
    });
  }, [calculePoints]);

  const onKeyPress = useCallback(e => {
    if (e.keyCode === 13) {
      addWord();
    }
  }, [addWord]);

  const renderNewWord = useMemo(() => (
    <div className='p-inputgroup'>
      <span className='p-inputgroup-addon'>{newWord.points}</span>
      <InputText
        placeholder='New word'
        value={newWord.value}
        onChange={onChangeNewWork}
        onKeyUp={onKeyPress}
      />
      <Button
        icon='pi pi-plus'
        className='p-button-warning'
        onClick={addWord}
      />
    </div>
  ), [addWord, newWord, onChangeNewWork, onKeyPress]);

  const removeWord = useCallback(index => {
    const updatedWords = [...words];
    updatedWords.splice(index, 1);
    setWords(updatedWords);
  }, [words]);

  const renderWord = useCallback((word, index) => (
    <div className='col-12' key={index}>
      <div className='p-inputgroup'>
        <span className='p-inputgroup-addon'>{word.points}</span>
        <InputText
          disabled
          value={word.value}
        />
        <Button
          icon='pi pi-times'
          className='p-button-danger'
          onClick={() => removeWord(index)}
        />
      </div>
    </div>
  ), [removeWord]);

  const renderWords = useMemo(() => {
    const reversed = [...words].reverse();
    return (
      reversed.map((word, index) => (
        renderWord(word, index)
      ))
    );
  }, [renderWord, words]);

  const totalPoints = useMemo(() => {
    let tp = 0;
    words.forEach(({ points }) => {
      tp = tp + points;
    });
    return tp;
  }, [words]);

  const reset = useCallback(() => {
    setWords([]);
    setNewWord({ value: '', points: 0 });
  }, []);

  return (
    <div className='grid'>
      <div className='col-12'>
        <div className='p-3 h-full'>
          <div className='shadow-2 p-3 h-full flex flex-column' style={{ borderRadius: '6px' }}>

            <div className='col-12'>
              <div className='grid'>
                <div className='col-2'>
                  <div className='col-12'>
                    <div className='p-inputgroup'>
                      <span className='p-inputgroup-addon'>{totalPoints}</span>
                    </div>
                  </div>
                </div>
                <div className='col-10'>
                  <div className='text-900 font-medium text-xl mb-2'>ordleg</div>
                  <div className='text-600'>word play</div>
                </div>
              </div>
            </div>

            <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />

            <div className='col-12'>
              {renderNewWord}
            </div>

            {words.length > 0 ?
              <>
                <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />

                <div className='col-12'>
                  <div className='grid'>
                    {renderWords}
                  </div>
                </div>

                <hr className='my-3 mx-0 border-top-1 border-bottom-none border-300' />

                <div className='col-12' style={{ textAlign: 'right' }}>
                  <Button
                    type='button'
                    label='Reset game'
                    icon='pi pi-times'
                    className='p-button-danger'
                    badge={words.length}
                    badgeClassName='p-badge-danger'
                    onClick={reset}
                  />
                </div>
              </>
              : <></>
            }

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
