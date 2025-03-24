import React, { useState, useEffect } from 'react';
import { buildPath } from './buildPath.js';
import RichTextEditor from './GanttChart/RichTextEditor.js'

function AnnouncementModal({showAnnouncementModal, setShowAnnouncementModal, editable}) {
    const [show, setShow] = useState(showAnnouncementModal ?? false);
    const [editMode, setEditMode] = useState(false);
    const[text, setText] = useState('')
    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await fetch(buildPath(`api/dashboard/account`), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                  });
                const data = await response.json();
                setText(data.text || 'Add a description here...');
            } catch (error) {
                console.error("Error fetching announcement:", error);
            }
        };

        fetchAnnouncement();

        const userData = localStorage.getItem('user_data');
        const modalShown = localStorage.getItem('modalShown');
        if (userData && !modalShown) {
          setShow(true);
          localStorage.setItem('modalShown', 'true');
        }
      }, []);
    
    const handleCloseModal = () => {
        setShow(false);

        if(showAnnouncementModal)
            setShowAnnouncementModal(false);
    };

    const handleEditModal = () => {
        setEditMode(true)
    }

    const handleSave = async () => {
        setEditMode(false)
        
        try{
            const response = await fetch(buildPath(`api/dashboard/account`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text }),
              });
              if (response.ok) {

                const data = await response.json();
                setText(data.text); 
                console.log(editMode)
            } else {
                console.error('Failed to save announcement');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <div>
            {show && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" id="announcementModal" aria-labelledby="announcementModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{maxHeight: '1000px'}}>
                            <div className="modal-header">
                                <h3 className="modal-title" id="announcementModalLabel">What's New</h3>
                            </div>
                            <div className="modal-body">
                            {editMode ?
                            <RichTextEditor
                            taskDescription={text}
                            setTaskDescription={setText}
                            />
                            :
                            <div 
                            id="textbox" 
                            dangerouslySetInnerHTML={{
                                __html: text?.trim() ? text : 'Add a description here...',
                            }} 
                            />
                            }
                            </div>
                            <div className="" style={{ display: 'flex',justifyContent: 'center', }}>
                                { editable ? (<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={editMode ? handleSave: handleEditModal}>{editMode ? 'Save' : 'Edit'}</button>) : <></>}
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
                            </div>
                         </div>
                        </div>
                        </div>
                    )}
        </div>
    )

}

export default AnnouncementModal;
