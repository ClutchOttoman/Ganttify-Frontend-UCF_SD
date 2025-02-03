import React, { useEffect, useState } from "react";
import { buildPath } from './buildPath.js';

const ProjectInviteLink = ({ projectId }) => {
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInviteLink = async () => {
      setLoading(true);
      try {
        const response = await fetch(buildPath(`api/get-invite-link/${projectId}`), { method: 'GET' })
        
        if (!response.ok) {
          throw new Error("Failed to fetch invite link");
        }
        const data = await response.json();
        setInviteLink(data.inviteLink);
      } catch (err) {
        setError("Failed to fetch invite link.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInviteLink();
  }, [projectId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    // alert("Invite link copied to clipboard!");
  };

  if (loading) return <p>Loading invite link...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="invite-link-container">
      <h3>Project Invite Link</h3>
      {inviteLink ? (
        <>
          <p>
            Share this link with team members to join the project:
            <br />
            <a class="link" href={inviteLink} target="_blank" rel="noopener noreferrer">
              {inviteLink}
            </a>
          </p>
          <button onClick={copyToClipboard}>Copy Link</button>
        </>
      ) : (
        <p>No invite link available for this project.</p>
      )}
    </div>
  );
};

export default ProjectInviteLink;
