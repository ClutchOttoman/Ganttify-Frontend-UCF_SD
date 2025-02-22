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
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="announcementModalLabel">What's New</h5>
                            </div>
                            <div className="modal-body">
                                {/* Write new features or updates here */}
                                <h3>New Features</h3>
                                <p>- Added search bar in chart page</p>
                                <p>- Added persistent login</p>
                                <h3>Bug Fixes</h3>
                                <p>- Fixed Team Invite Link</p>
                                <p>- Fixed task details from randomly closing when viewing it from task name</p>          
                                <p>- Fixed various visual bugs</p>
                                <h3>Next Update</h3>
                                <p>- Fixing real-time rendering when updating task start/end dates + categories</p>   
                                <p>Thank you for the feedback! Continue to let us know about more bugs and any potential features you would like to see!</p>                                   
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