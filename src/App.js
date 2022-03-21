// Prime CSSs
// import 'primereact/resources/themes/saga-orange/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // primeflex

import { useCallback, useMemo, useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { SelectButton } from 'primereact/selectbutton';
import { Image } from 'primereact/image';
import { Badge } from 'primereact/badge';

function App() {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({ value: '', points: 0 });
  const [editingWord, setEditingWord] = useState(); // {index: -1, value: '', points: 0}

  // Theme
  const themes = useMemo(() => [
    {
      label: 'Light',
      value: 'saga-orange',
      url: 'themes/saga-orange/theme.css'
    },
    {
      label: 'Dark',
      value: 'arya-orange',
      url: 'themes/arya-orange/theme.css'
    }
  ], []);

  const [theme, setTheme] = useState('saga-orange');

  const onThemeChange = useCallback(e => {
    setTheme(e.value);
  }, []);

  useEffect(() => {
    const currentTheme = theme ? themes.find(t => t.value === theme) : themes[0];
    if (currentTheme) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = currentTheme.url;
      document.head.appendChild(link);
    }
  }, [theme, themes]);

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

  const onKeyPressNewWord = useCallback(e => {
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
        onKeyUp={onKeyPressNewWord}
        disabled={!!editingWord}
      />
      <Button
        icon='pi pi-plus'
        className='p-button-warning'
        onClick={addWord}
        disabled={!!editingWord}
      />
    </div>
  ), [addWord, newWord, onChangeNewWork, onKeyPressNewWord, editingWord]);

  const removeWord = useCallback(index => {
    setWords(words.filter((_, i) => i !== index));
    setEditingWord(null);
  }, [words]);

  const editWord = useCallback(index => {
    setEditingWord({
      index,
      value: words[index].value,
      points: words[index].points
    });
  }, [words]);

  const saveEditingWord = useCallback(() => {
    const updatedWords = [...words];
    updatedWords[editingWord.index] = {
      value: editingWord.value,
      points: editingWord.points
    };
    setWords(updatedWords);

    setEditingWord(null);
  }, [editingWord, words]);

  const onChangeEditingWork = useCallback(e => {
    let value = e.target.value ?? '';

    if (value) {
      value = value.toUpperCase();
    }

    const points = calculePoints(value);

    setEditingWord({
      ...editingWord,
      value,
      points
    });
  }, [calculePoints, editingWord]);

  const onKeyPressEditingWork = useCallback(e => {
    if (e.keyCode === 13) {
      saveEditingWord();
    }
  }, [saveEditingWord]);

  const renderWord = useCallback((word, index) => (
    <div className='col-12' key={index}>
      <Inplace active={editingWord?.index === index} onToggle={() => editWord(index)}>
        <InplaceDisplay>
          <div className='p-inputgroup'>
            <span className='p-inputgroup-addon'>{word.points}</span>
            <InputText
              disabled
              value={word.value}
            />
          </div>
        </InplaceDisplay>
        <InplaceContent>
          <div className='p-inputgroup'>
            <span className='p-inputgroup-addon'>{editingWord?.points}</span>
            <Button
              icon='pi pi-check'
              className='p-button-success'
              onClick={saveEditingWord}
            />
            <InputText
              value={editingWord?.value}
              onChange={onChangeEditingWork}
              onKeyUp={onKeyPressEditingWork}
            />
            <Button
              icon='pi pi-times'
              className='p-button-danger'
              onClick={() => removeWord(index)}
            />
          </div>
        </InplaceContent>
      </Inplace>
    </div>
  ), [removeWord, editingWord, saveEditingWord, onChangeEditingWork, onKeyPressEditingWork, editWord]);

  const renderWords = useMemo(() => {
    const wordsMapped = words.map((word, index) => (
      renderWord(word, index)
    ));
    return wordsMapped.reverse();
  }, [renderWord, words]);

  const totalPoints = useMemo(() => {
    let tp = 0;
    words.forEach(({ points }) => {
      tp = tp + points;
    });
    return tp;
  }, [words]);

  // const reset = useCallback(() => {
  //   setWords([]);
  //   setNewWord({value: '', points: 0});
  // }, []);

  return (
    <div className='grid'>
      <div className='col-12'>
        <div className='p-3 h-full'>
          <div className='shadow-2 p-3 h-full flex flex-column' style={{ borderRadius: '6px' }}>

            <div className='col-12'>
              <div className='grid'>

                <div className='col-2'>
                  <Image src='/logo512.png' width='64' />
                  {totalPoints > 0 ?
                    <Badge value={totalPoints} style={{ position: 'relative', right: totalPoints > 100 ? '22px' : '15px' }} />
                    : <></>
                  }
                </div>

                <div className='col-5'>
                  <div className='text-900 font-medium text-xl mb-2'>ordleg</div>
                  <div className='text-600'>word play</div>
                </div>

                <div className='col-5' style={{ textAlign: 'right' }}>
                  <SelectButton
                    value={theme}
                    options={themes}
                    onChange={onThemeChange}
                  />
                </div>

              </div>
            </div>

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
