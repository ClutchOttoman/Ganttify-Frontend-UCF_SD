import React, { useState, useEffect } from 'react';

function AnnouncementModal() {
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        const modalShown = localStorage.getItem('modalShown');
    
        if (userData && !modalShown) {
          setShowAnnouncementModal(true);
          localStorage.setItem('modalShown', 'true');
        }
      }, []);
    const handleCloseModal = () => {
        setShowAnnouncementModal(false);
    };

    return(
        <div>
            {showAnnouncementModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" id="announcementModal" aria-labelledby="announcementModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{maxHeight: '1000px'}}>
                            <div className="modal-header">
                                <h3 className="modal-title" id="announcementModalLabel">What's New</h3>
                            </div>
                            <div className="modal-body">
                                {/* Write new features or updates here */}
                                <h3>New Features</h3>
                                <p>- New and Improved todo list.</p>
                                <p>- Updated About Us Section to feature this semester's Ganttify team!</p>
                                <h3>Bug Fixes</h3>
                                <p>- Fixing timeline rendering when updating task start/end dates and categories.</p>         
                                <p>- Fixed various visual bugs.</p>
                                <h3>Next Update</h3>
                                <p>- More customization options for UI and other new features.</p>
                                <p>Thank you for the feedback. Continue to let us know about any bugs and potential features you would like to see in the future!</p>                                   
                            </div>
                            <div className="modal-footer">
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