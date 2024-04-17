import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {  Button } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import './editor.component.css';

function debounce(func, timeout = 2000) {
    let timer;
    return (...args) => {
      console.log(args);
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

function NotesEditor(props) {
  const { currentNote, saveNoteContent } = props;
  let notesEditorObj = null;
  const debounceSaveCurrentNote = debounce(saveNoteContent);

  const saveNoteHandler = () => {
    notesEditorObj && debounceSaveCurrentNote({...currentNote, content: notesEditorObj.getData()});
  }
  return (
    <section className="editor">
        <CKEditor
            editor={ ClassicEditor }
            data={currentNote.content}
            onReady={ editor => {
                notesEditorObj = editor;
            } }
            onChange={ ( event ) => {
                
            } }
            onBlur={ ( event, editor ) => {
                console.log( 'Blur.', editor );
            } }
        />

        <Button variant='contained' className='save-note-btn' onClick={saveNoteHandler}>
          <DoneRoundedIcon />
          <span>Add</span>
        </Button>
    </section>
  );
}

export default NotesEditor;