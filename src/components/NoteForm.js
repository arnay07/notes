import { useState } from 'react';

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('');

  const buttonStyle = {
    width: '10%',
    height: 30,
    cursor: 'pointer',
  };
  const formStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  };

  const inputStyle = {
    width: '70%',
    height: 30,
  };

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: true,
    });
    setNewNote('');
  };

  return (
    <form onSubmit={addNote} style={formStyle}>
      <label htmlFor="newNote">New note :&nbsp; </label>
      <input
        style={inputStyle}
        value={newNote}
        onChange={({ target }) => setNewNote(target.value)}
      />
      &nbsp;
      <button style={buttonStyle} type="submit">
        Save
      </button>
    </form>
  );
};

export default NoteForm;
