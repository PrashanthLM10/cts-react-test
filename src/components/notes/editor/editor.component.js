import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './editor.component.css';

function debounce(func, timeout = 2000) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

function NotesEditor(props) {
  const { currentNote, saveNoteContent } = props;
  let notesEditorObj = null;
  const debounceSaveCurrentNote = debounce(saveNoteContent);
  return (
    <section className="editor">
        <CKEditor
            editor={ ClassicEditor }
            data={currentNote.content}
            onReady={ editor => {
                notesEditorObj = editor;
            } }
            onChange={ ( event ) => {
                debounceSaveCurrentNote({...currentNote, content: notesEditorObj?.getData() || currentNote.content});
            } }
            onBlur={ ( event, editor ) => {
                console.log( 'Blur.', editor );
            } }
        />
    </section>
  );
}

export default NotesEditor;