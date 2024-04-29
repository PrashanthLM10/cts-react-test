import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {  Button } from '@mui/material';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { debounce } from '../../../utils/debounce';
import './editor.component.css';

let notesEditorObj = null;
function NotesEditor(props) {
  const { currentNote, saveNoteContent, deleteNote } = props;
  const debounceSaveCurrentNote = debounce(saveNoteContent);

  const saveNoteHandler = () => {
    notesEditorObj && debounceSaveCurrentNote({...currentNote, content: notesEditorObj.getData()});
  }
  return (
    <section className="editor">
        <CKEditor
            editor={ ClassicEditor }
            data={currentNote.content || ''}
            onReady={ editor => {
                notesEditorObj = editor;
            } }
            onChange={ ( event ) => {
                
            } }
            onBlur={ ( event, editor ) => {
            } }
        />

        <Button variant='contained' className='save-note-btn' onClick={saveNoteHandler}>
          <DoneRoundedIcon />
          <span>Save</span>
        </Button>
    </section>
  );
}

export default NotesEditor;