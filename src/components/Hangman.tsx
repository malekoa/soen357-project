import { useState } from 'react';

const Hangman = () => {
  // Word list (you can expand this later)
  const words = ['banana', 'guitar', 'pirate', 'rocket', 'puzzle', 'garden'];
  const randomWord = words[Math.floor(Math.random() * words.length)].toLowerCase();

  const [word, setWord] = useState(randomWord); // Word to guess
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]); // Correct guesses
  const [wrongGuesses, setWrongGuesses] = useState<number>(0); // Number of wrong guesses
  const [gameOver, setGameOver] = useState(false); // Game over state

  const maxGuesses = 6; // Max incorrect guesses

  const handleGuess = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter) || wrongGuesses >= maxGuesses) return;

    if (word.includes(letter)) {
      setGuessedLetters((prev) => [...prev, letter]);
    } else {
      setWrongGuesses((prev) => prev + 1);
    }

    // Check if the player has won
    const allLettersGuessed = word.split('').every((char) => guessedLetters.includes(char) || char === letter);
    if (allLettersGuessed) {
      setGameOver(true);
    }

    // Check if the player has lost
    if (wrongGuesses + 1 === maxGuesses && !word.includes(letter)) {
      setGameOver(true);
    }
  };

  const renderWord = () => {
    return word.split('').map((char, index) => (
      <span key={index} className="inline-block w-8 gap-2 text-lg text-center border-b-2">
        {guessedLetters.includes(char) ? char : ''}
      </span>
    ));
  };

  const renderHangmanSlider = () => {
    const percentage = (wrongGuesses / maxGuesses) * 100;
    return (
      <div className="w-full h-3 mb-2 overflow-hidden bg-gray-300 rounded">
        <div
          className="h-full transition-all duration-300 bg-red-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const resetGame = () => {
    const newWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
    setWord(newWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
  };

  return (
    <div className="px-2 py-6">
      <div className='flex w-full mb-2 border-t'></div>
      <h2 className="mb-4 text-2xl font-bold">Guess The Word!</h2>
      {renderHangmanSlider()}
      <div className="mb-4">{renderWord()}</div>
      <div className="flex flex-wrap justify-center w-full gap-2">
        {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || gameOver}
            className={`flex w-8 h-8 justify-center items-center rounded ${guessedLetters.includes(letter) || wrongGuesses >= maxGuesses
                ? 'bg-gray-300'
                : 'bg-blue-500 text-white'
              }`}
          >
            {letter}
          </button>
        ))}
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl font-bold">
            {wrongGuesses >= maxGuesses ? `You lost! The word was:` : 'You won!'} {wrongGuesses >= maxGuesses && word}
          </p>
          <button
            onClick={resetGame}
            className="px-4 py-2 mt-2 text-white bg-green-500 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Hangman;
