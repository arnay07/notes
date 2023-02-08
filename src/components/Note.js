const Note = ({ note, toggleImportance }) => {
  const noteStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
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
