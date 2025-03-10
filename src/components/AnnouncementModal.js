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
                                <h3>Server Maintenance</h3>
                                <p>Dear Users,<br></br><br></br>
Please be advised that our server will undergo scheduled maintenance on 3/14 at 11:00 AM. During this time, the website will be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your understanding.</p>                                 
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
