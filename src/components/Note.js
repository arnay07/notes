const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'Make not important' : 'Make important';
  return (
    <tr>
      <td>{note.content}</td>
      <td>
        <button onClick={toggleImportance}>{label}</button>
      </td>
    </tr>
  );
};

export default Note;
