import React from 'react';

const Note = ({ note, toggleImportance }) => {
  const noteStyle = {
    paddingTop: 20,
  };

  const label = note.important ? 'Make not important' : 'Make important';
  return (
    <li style={noteStyle}>
      {note.content}
      &nbsp;
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Note;
