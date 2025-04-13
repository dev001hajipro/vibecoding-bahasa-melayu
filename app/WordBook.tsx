"use client";
import React, { useEffect, useState } from "react";

const WordBook: React.FC = () => {
  const [words, setWords] = useState<{ word: string; translation: string }[]>(
    []
  );
  const [newWord, setNewWord] = useState<string>("");
  const [newTranslation, setNewTranslation] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedWord, setEditedWord] = useState<string>("");
  const [editedTranslation, setEditedTranslation] = useState<string>("");

  // Load words from localStorage on component mount
  useEffect(() => {
    const storedWords = localStorage.getItem("wordBook");
    if (storedWords) {
      setWords(JSON.parse(storedWords));
    }
  }, []);

  // Save words to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wordBook", JSON.stringify(words));
  }, [words]);

  const addWord = () => {
    if (newWord.trim() !== "" && newTranslation.trim() !== "") {
      setWords([
        ...words,
        { word: newWord.trim(), translation: newTranslation.trim() },
      ]);
      setNewWord("");
      setNewTranslation("");
    }
  };

  const deleteWord = (index: number) => {
    const updatedWords = words.filter((_, i) => i !== index);
    setWords(updatedWords);
  };

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ms-MY"; // マレーシア語の言語コード
    window.speechSynthesis.speak(utterance);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedWord(words[index].word);
    setEditedTranslation(words[index].translation);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedWords = [...words];
      updatedWords[editingIndex] = {
        word: editedWord,
        translation: editedTranslation,
      };
      setWords(updatedWords);
      setEditingIndex(null);
      setEditedWord("");
      setEditedTranslation("");
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedWord("");
    setEditedTranslation("");
  };

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
        マレーシア語の単語帳
      </h1>
      <div className="flex justify-center mb-4 space-x-2">
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="新しい単語を入力"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={newTranslation}
          onChange={(e) => setNewTranslation(e.target.value)}
          placeholder="日本語訳を入力"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addWord}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>
      <ul className="max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto bg-white shadow-md rounded-lg divide-y divide-gray-200">
        {words.map((entry, index) => (
          <li
            key={index}
            className="flex justify-between items-center px-4 py-2"
          >
            {editingIndex === index ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={editedWord}
                  onChange={(e) => setEditedWord(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={editedTranslation}
                  onChange={(e) => setEditedTranslation(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-gray-700 font-bold">{entry.word}</p>
                  <p className="text-gray-500 text-sm">{entry.translation}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => speakWord(entry.word)}
                    className="text-blue-500 hover:text-blue-700 px-4 py-2"
                  >
                    再生
                  </button>
                  <button
                    onClick={() => startEditing(index)}
                    className="text-yellow-500 hover:text-yellow-700 px-4 py-2"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteWord(index)}
                    className="text-red-500 hover:text-red-700 px-4 py-2"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordBook;
